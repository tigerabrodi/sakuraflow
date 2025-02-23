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
