import { flow } from '../core/flow'
import type { Flow, Operation } from '../core/types'

/**
 * Creates an operation that concatenates multiple flows together in sequence.
 * Values from each flow are emitted in order after the previous flow completes.
 *
 * @param flows - The flows to concatenate after the source flow
 *
 * @example
 * ```ts
 * const numbers = flow([1, 2]).pipe(
 *   concat(flow([3, 4]), flow([5, 6]))
 * )
 *
 * const result = [...numbers]
 * // Result: [1, 2, 3, 4, 5, 6]
 * ```
 */
export function concat<TValue>(
  ...flows: Array<Flow<TValue>>
): Operation<TValue, TValue> {
  return (source: Flow<TValue>): Flow<TValue> => {
    function* concatGenerator() {
      // First yield all values from source
      // `yield*` is used to yield all values from an iterable
      // so youre letting the other iterables take over the control
      // in this case, it would mean that when source is fully done, then we continue with the code
      yield* source

      // Then yield from each additional flow
      for (const nextFlow of flows) {
        yield* nextFlow
      }
    }

    return flow(concatGenerator())
  }
}

/**
 * Creates an operation that combines values from two flows into pairs.
 * Each pair contains one value from each flow. The operation completes when either flow completes.
 *
 * @param otherFlow - The flow to combine with the source flow
 *
 * @example
 * ```ts
 * const numbers = flow([1, 2, 3]).pipe(
 *   zip(flow(['a', 'b', 'c']))
 * )
 *
 * const result = [...numbers]
 * // Result: [[1, 'a'], [2, 'b'], [3, 'c']]
 * ```
 */
export function zip<TValue, TOther>(
  otherFlow: Flow<TOther>
): Operation<TValue, [TValue, TOther]> {
  return (source: Flow<TValue>): Flow<[TValue, TOther]> => {
    // Sync version
    function* syncZipGenerator() {
      const sourceIterator = source[Symbol.iterator]()
      const otherIterator = otherFlow[Symbol.iterator]()

      while (true) {
        const sourceNext = sourceIterator.next()
        const otherNext = otherIterator.next()

        if (sourceNext.done || otherNext.done) break

        yield [sourceNext.value, otherNext.value] as [TValue, TOther]
      }
    }

    // Async version
    async function* asyncZipGenerator() {
      const sourceIterator = source[Symbol.asyncIterator]()
      const otherIterator = otherFlow[Symbol.asyncIterator]()

      while (true) {
        const [sourceNext, otherNext] = await Promise.all([
          sourceIterator.next(),
          otherIterator.next(),
        ])

        if (sourceNext.done || otherNext.done) break

        yield [sourceNext.value, otherNext.value] as [TValue, TOther]
      }
    }

    const isAsync = source.isAsync() || otherFlow.isAsync()

    if (isAsync) {
      return flow(asyncZipGenerator())
    }
    return flow(syncZipGenerator())
  }
}
