import { flow } from '../core/flow'
import type { Flow, Operation } from '../core/types'

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
