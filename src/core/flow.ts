import type { Flow, IterableInput, Operation } from './types'

export class FlowImpl<TValue> implements Flow<TValue> {
  constructor(private source: IterableInput<TValue>) {}

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

export function flow<TValue>(source: IterableInput<TValue>): Flow<TValue> {
  return new FlowImpl(source)
}
