import { flow } from '../core/flow'
import type { Flow, Operation } from '../core/types'

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
