import { flow } from '../core/flow'
import type { Flow, Operation } from '../core/types'

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
