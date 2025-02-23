import { flow } from '../core/flow'
import type { Flow, Operation } from '../core/types'

/**
 * Creates an operation that takes only the first n values from the flow.
 *
 * @param n - The number of values to take
 *
 * @example
 * ```ts
 * const numbers = flow([1, 2, 3, 4, 5]).pipe(
 *   take(3)
 * )
 *
 * const result = [...numbers]
 * // Result: [1, 2, 3]
 * ```
 */
export function take<TValue>(n: number): Operation<TValue, TValue> {
  return (flowInput: Flow<TValue>): Flow<TValue> => {
    function* takeGenerator() {
      let count = 0
      for (const value of flowInput) {
        // Stop the iteration if we've taken enough items
        if (count >= n) break
        yield value
        count++
      }
    }

    return flow(takeGenerator())
  }
}

/**
 * Creates an operation that skips the first n values from the flow.
 *
 * @param n - The number of values to skip
 *
 * @example
 * ```ts
 * const numbers = flow([1, 2, 3, 4, 5]).pipe(
 *   skip(2)
 * )
 *
 * const result = [...numbers]
 * // Result: [3, 4, 5]
 * ```
 */
export function skip<TValue>(n: number): Operation<TValue, TValue> {
  return (flowInput: Flow<TValue>): Flow<TValue> => {
    function* skipGenerator() {
      let count = 0
      for (const value of flowInput) {
        // only start yielding values after we've skipped n items
        if (count >= n) {
          yield value
        }
        count++
      }
    }

    return flow(skipGenerator())
  }
}

/**
 * Creates an operation that takes values from the flow as long as they satisfy the predicate.
 * Stops taking values as soon as the predicate returns false.
 *
 * @param predicate - Function that tests each value
 *
 * @example
 * ```ts
 * const numbers = flow([1, 2, 3, 4, 1]).pipe(
 *   takeWhile(x => x < 4)
 * )
 *
 * const result = [...numbers]
 * // Result: [1, 2, 3]
 * ```
 */
export function takeWhile<TValue>(
  predicate: (value: TValue) => boolean
): Operation<TValue, TValue> {
  return (flowInput: Flow<TValue>): Flow<TValue> => {
    function* takeWhileGenerator() {
      for (const value of flowInput) {
        // Stop the iteration if the predicate returns false
        if (!predicate(value)) break

        // While predicate returns true, yield values
        yield value
      }
    }

    return flow(takeWhileGenerator())
  }
}

/**
 * Creates an operation that skips values from the flow as long as they satisfy the predicate.
 * Starts taking values as soon as the predicate returns false and continues taking all subsequent values.
 *
 * @param predicate - Function that tests each value
 *
 * @example
 * ```ts
 * const numbers = flow([1, 2, 3, 4, 1]).pipe(
 *   skipWhile(x => x < 3)
 * )
 *
 * const result = [...numbers]
 * // Result: [3, 4, 1]
 * ```
 */
export function skipWhile<TValue>(
  predicate: (value: TValue) => boolean
): Operation<TValue, TValue> {
  return (flowInput: Flow<TValue>): Flow<TValue> => {
    function* skipWhileGenerator() {
      // We start by skipping all values
      let isSkipping = true

      for (const value of flowInput) {
        // If we're skipping which starts as true
        // and the predicate returns false, we stop skipping
        // predicate being false means that the condition should not be skipped anymore
        if (isSkipping && !predicate(value)) {
          isSkipping = false
        }

        if (!isSkipping) {
          yield value
        }
      }
    }

    return flow(skipWhileGenerator())
  }
}
