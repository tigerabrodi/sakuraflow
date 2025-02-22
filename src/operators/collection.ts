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
