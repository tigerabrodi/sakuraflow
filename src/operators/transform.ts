import { flow } from '../core/flow'
import { Flow } from '../core/types'

import { Operation } from '../core/types'

export function map<TSource, TResult>(
  transform: (value: TSource) => TResult
): Operation<TSource, TResult> {
  return (flowInput: Flow<TSource>): Flow<TResult> => {
    function* transformGenerator() {
      for (const value of flowInput) {
        yield transform(value)
      }
    }

    // Flow expects an iterator
    // We don't wanna pass the generator function directly
    // By calling the generator, we get the generator object which is an iterator
    // you can then e.g. spread it into an array or iterate over it with a for...of loop
    return flow(transformGenerator())
  }
}

export function filter<TValue>(
  predicate: (value: TValue) => boolean
): Operation<TValue, TValue> {
  return (flowInput: Flow<TValue>): Flow<TValue> => {
    function* filterGenerator() {
      for (const value of flowInput) {
        // Only yield values that pass the predicate
        if (predicate(value)) {
          yield value
        }
      }
    }

    return flow(filterGenerator())
  }
}
