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
