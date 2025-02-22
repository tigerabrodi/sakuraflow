import type { Flow } from './types'

// implements is a TypeScript feature that ensures that the class implements the Flow interface
class FlowImpl<IteratorValue> implements Flow<IteratorValue> {
  constructor(private source: Iterable<IteratorValue>) {}

  *[Symbol.iterator](): Iterator<IteratorValue> {
    // We use yield* to delegate iteration to the source
    // This works for anything that implements the iterable protocol
    yield* this.source
  }
}

export function flow<IteratorValue>(
  source: Iterable<IteratorValue>
): Flow<IteratorValue> {
  return new FlowImpl(source)
}
