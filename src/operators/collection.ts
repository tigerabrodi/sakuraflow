import { flow } from '../core/flow'
import type { Flow, Operation } from '../core/types'

/**
 * Creates an operation that groups values into batches of a specified size.
 * The last batch may be smaller if there aren't enough values to fill it.
 *
 * @param size - The size of each batch
 *
 * @example
 * ```ts
 * const numbers = flow([1, 2, 3, 4, 5]).pipe(
 *   batch(2)
 * )
 *
 * const result = [...numbers]
 * // Result: [[1, 2], [3, 4], [5]]
 * ```
 */
export function batch<TValue>(size: number): Operation<TValue, Array<TValue>> {
  return (flowInput: Flow<TValue>): Flow<Array<TValue>> => {
    function* batchGenerator() {
      let batch: Array<TValue> = []

      for (const value of flowInput) {
        batch.push(value)

        if (batch.length === size) {
          yield batch
          // reset when size hit
          batch = []
        }
      }

      // Don't forget to yield the last incomplete batch
      if (batch.length > 0) {
        yield batch
      }
    }

    return flow(batchGenerator())
  }
}

/**
 * Creates an operation that yields sliding windows of values of a specified size.
 * Each window contains the specified number of consecutive values from the source.
 *
 * @param size - The size of each window
 *
 * @example
 * ```ts
 * const numbers = flow([1, 2, 3, 4]).pipe(
 *   window(2)
 * )
 *
 * const result = [...numbers]
 * // Result: [[1, 2], [2, 3], [3, 4]]
 * ```
 */
export function window<TValue>(size: number): Operation<TValue, Array<TValue>> {
  return (flowInput: Flow<TValue>): Flow<Array<TValue>> => {
    function* windowGenerator() {
      const window: Array<TValue> = []
      // Get a single iterator that we'll use throughout
      // Otherwise second loop can not continue where left off
      const iterator = flowInput[Symbol.iterator]()

      if (size <= 0) return

      // Fill initial window
      let next = iterator.next()

      // Fill initial window
      // Continue until we have enough values or end of input
      // We always do .next() and then use it's value as long as done hasn't been reached
      while (!next.done && window.length < size) {
        window.push(next.value)
        next = iterator.next()
      }

      // If ok, yield first window
      if (window.length < size) return

      // Yield first window
      yield [...window]

      // Continue with same iterator
      // We'll pick up where we left and we're also continue on the same window
      while (!next.done) {
        // Remove first element
        window.shift()
        // Add new element
        window.push(next.value)
        // Yield copy of window
        yield [...window]
        // Get next value, will continue if not done
        next = iterator.next()
      }
    }

    return flow(windowGenerator())
  }
}
