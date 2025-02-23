import type { Flow, IterableInput, Operation } from './types'

export class FlowImpl<TValue> implements Flow<TValue> {
  constructor(private source: IterableInput<TValue>) {}

  isAsync(): boolean {
    return Symbol.asyncIterator in this.source
  }

  // This is the reason why e.g. if array you can do
  // const result = [...flow([1, 2, 3])]
  // and get [1, 2, 3]
  *[Symbol.iterator](): Iterator<TValue> {
    if (Symbol.iterator in this.source) {
      yield* this.source
    } else {
      throw new Error('Cannot synchronously iterate over async source')
    }
  }

  async *[Symbol.asyncIterator](): AsyncIterator<TValue> {
    if (Symbol.asyncIterator in this.source) {
      yield* this.source
    } else if (Symbol.iterator in this.source) {
      yield* this.source
    } else {
      // Should never happen, we just do this for type safety
      // shouldn't happen because source is always iterable
      throw new Error('Source must be either sync or async iterable')
    }
  }

  pipe<A>(op1: Operation<TValue, A>): Flow<A>

  pipe<A, B>(op1: Operation<TValue, A>, op2: Operation<A, B>): Flow<B>

  pipe<A, B, C>(
    op1: Operation<TValue, A>,
    op2: Operation<A, B>,
    op3: Operation<B, C>
  ): Flow<C>

  pipe<A, B, C, D>(
    op1: Operation<TValue, A>,
    op2: Operation<A, B>,
    op3: Operation<B, C>,
    op4: Operation<C, D>
  ): Flow<D>

  pipe<A, B, C, D, E>(
    op1: Operation<TValue, A>,
    op2: Operation<A, B>,
    op3: Operation<B, C>,
    op4: Operation<C, D>,
    op5: Operation<D, E>
  ): Flow<E>
  pipe<A, B, C, D, E, F>(
    op1: Operation<TValue, A>,
    op2: Operation<A, B>,
    op3: Operation<B, C>,
    op4: Operation<C, D>,
    op5: Operation<D, E>,
    op6: Operation<E, F>
  ): Flow<F>
  pipe<A, B, C, D, E, F, G>(
    op1: Operation<TValue, A>,
    op2: Operation<A, B>,
    op3: Operation<B, C>,
    op4: Operation<C, D>,
    op5: Operation<D, E>,
    op6: Operation<E, F>,
    op7: Operation<F, G>
  ): Flow<G>
  pipe<A, B, C, D, E, F, G, H>(
    op1: Operation<TValue, A>,
    op2: Operation<A, B>,
    op3: Operation<B, C>,
    op4: Operation<C, D>,
    op5: Operation<D, E>,
    op6: Operation<E, F>,
    op7: Operation<F, G>,
    op8: Operation<G, H>
  ): Flow<H>
  pipe<A, B, C, D, E, F, G, H, I>(
    op1: Operation<TValue, A>,
    op2: Operation<A, B>,
    op3: Operation<B, C>,
    op4: Operation<C, D>,
    op5: Operation<D, E>,
    op6: Operation<E, F>,
    op7: Operation<F, G>,
    op8: Operation<G, H>,
    op9: Operation<H, I>
  ): Flow<I>
  pipe<A, B, C, D, E, F, G, H, I, J>(
    op1: Operation<TValue, A>,
    op2: Operation<A, B>,
    op3: Operation<B, C>,
    op4: Operation<C, D>,
    op5: Operation<D, E>,
    op6: Operation<E, F>,
    op7: Operation<F, G>,
    op8: Operation<G, H>,
    op9: Operation<H, I>,
    op10: Operation<I, J>
  ): Flow<J>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pipe(...operations: Array<Operation<any, any>>): Flow<any> {
    if (operations.length === 0) {
      return this
    }

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let result: Flow<unknown> = this
    for (const operation of operations) {
      result = operation(result)
    }
    return new FlowImpl(result)
  }
}

/**
 * Creates a Flow instance from an iterable or async iterable source.
 * A Flow allows you to chain multiple operations using the pipe method,
 * processing data in a lazy, streaming fashion.
 *
 * @param source - An iterable or async iterable input source
 * @returns A Flow instance that can be used to chain operations
 *
 * @example
 * ```ts
 * const numbers = flow([1, 2, 3, 4, 5])
 *   .pipe(
 *     map(x => x * 2),
 *     filter(x => x > 5)
 *   );
 *
 * // Synchronously iterate
 * for (const num of numbers) {
 *   console.log(num); // Outputs: 6, 8, 10
 * }
 *
 * // Or with async source
 * const asyncNumbers = flow(async function* () {
 *   yield* [1, 2, 3];
 * }());
 *
 * for await (const num of asyncNumbers) {
 *   console.log(num); // Outputs: 1, 2, 3
 * }
 * ```
 */
export function flow<TValue>(source: IterableInput<TValue>): Flow<TValue> {
  return new FlowImpl(source)
}
