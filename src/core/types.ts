// Basic types remain the same
export type IterableInput<T> = Iterable<T> | AsyncIterable<T>
export type Operation<TSource, TResult> = (flow: Flow<TSource>) => Flow<TResult>

// We don't need the complex type machinery for unpacking tuples anymore
// since we're using explicit overloads
export interface Flow<TValue> {
  [Symbol.iterator](): Iterator<TValue>
  [Symbol.asyncIterator](): AsyncIterator<TValue>
  isAsync(): boolean

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
}
