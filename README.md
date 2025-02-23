# SakuraFlow

A lightweight, memory-efficient library for working with generator functions in TypeScript. Transform, combine, and process data streams with an elegant API that maintains the benefits of lazy evaluation.

## Why?

- 🌸 **Memory Efficient:** Process large datasets without loading everything into memory
- 🎯 **Composable:** Build complex data transformations with simple, chainable operations
- 🔄 **Lazy Evaluation:** Only process what you need, when you need it
- 🎭 **Flexible:** Works with both sync and async generators
- 🧪 **Type-Safe:** Built with TypeScript for great developer experience

## Installation

```bash
npm install @tigerabrodioss/sakuraflow
# or
pnpm add @tigerabrodioss/sakuraflow
# or
yarn add @tigerabrodioss/sakuraflow
# or
bun add @tigerabrodioss/sakuraflow
```

## Quick Example

```ts
import { flow } from '@tigerabrodioss/sakuraflow'

// Process numbers with multiple transformations
const result = flow([1, 2, 3, 4, 5]).pipe(
  filter((x) => x % 2 === 0), // Keep even numbers
  map((x) => x * 2), // Double them
  batch(2) // Group in pairs
)

console.log([...result])
// Output: [[2, 4], [8]]

// Work with async data
async function* source() {
  yield 1
  await sleep(1000)
  yield 2
  await sleep(1000)
  yield 3
}

const numbers = flow(source()).pipe(
  map((x) => x * 2),
  rateLimit(2000) // Ensure at least 2s between values
)

for await (const num of numbers) {
  console.log(num) // Logs 2, 4, 6 with 2s delays
}
```

## API Reference

### Transform Operations

```ts
map(fn: (value: T) => U)
filter(predicate: (value: T) => boolean)
```

### Control Operations

```ts
take(n: number)
skip(n: number)
takeWhile(predicate: (value: T) => boolean)
skipWhile(predicate: (value: T) => boolean)
```

### Collection Operations

```ts
batch(size: number)
window(size: number)
```

### Combine Operations

```ts
concat(...flows: Flow<T>[])
zip(otherFlow: Flow<U>)
```

### Async Operations

```ts
rateLimit(msBetweenYield: number)
```

## Limitations

- 🚫 Maximum 10 operations inside a pipe

## License

MIT
