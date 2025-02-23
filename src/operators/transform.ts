import { flow } from '../core/flow'
import { Flow } from '../core/types'

import { Operation } from '../core/types'

/**
 * Creates an operation that transforms each value in the flow using the provided function.
 *
 * @param transform - Function to apply to each value
 *
 * @example
 * ```ts
 * const numbers = flow([1, 2, 3]).pipe(
 *   map(x => x * 2)
 * )
 *
 * const result = [...numbers]
 * // Result: [2, 4, 6]
 * ```
 */
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

/**
 * Creates an operation that filters values from the flow based on a predicate.
 * Only values that satisfy the predicate are included in the output.
 *
 * @param predicate - Function that tests each value
 *
 * @example
 * ```ts
 * const numbers = flow([1, 2, 3, 4]).pipe(
 *   filter(x => x % 2 === 0)
 * )
 *
 * const result = [...numbers]
 * // Result: [2, 4]
 * ```
 */
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
