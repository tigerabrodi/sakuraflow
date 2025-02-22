// This lets us work with any iterable, including arrays, generators, and more
export interface Flow<T> {
  [Symbol.iterator](): Iterator<T>
}
