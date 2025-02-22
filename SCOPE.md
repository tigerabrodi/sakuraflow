1. **Basic Flow Creation and Iteration**

```typescript
// Creating flows from different sources
const arrayFlow = flow([1, 2, 3])
const generatorFlow = flow(function* () {
  yield 1
  yield 2
  yield 3
})

// Basic iteration
for (const value of arrayFlow) {
  console.log(value)
}

// Tests would verify:
// - Can create from array
// - Can create from generator
// - Can iterate values
// - Maintains order
```

2. **Basic Transformations (map, filter)**

```typescript
const doubled = flow([1, 2, 3]).pipe(map((x) => x * 2))

const evens = flow([1, 2, 3, 4]).pipe(filter((x) => x % 2 === 0))

// Tests would verify:
// - map transforms each value
// - filter excludes/includes correctly
// - can chain operations
```

3. **Flow Control (take, skip)**

```typescript
const first2 = flow([1, 2, 3, 4]).pipe(take(2))

const skipFirst = flow([1, 2, 3, 4]).pipe(skip(1))

// Tests would verify:
// - take limits output
// - skip bypasses n elements
// - works with infinite generators
```

4. **Collection Operations (batch, window)**

```typescript
const batched = flow([1, 2, 3, 4, 5]).pipe(batch(2))
// Outputs: [1,2], [3,4], [5]

const windowed = flow([1, 2, 3, 4, 5]).pipe(window(3))
// Outputs: [1,2,3], [2,3,4], [3,4,5]

// Tests would verify:
// - correct batch sizes
// - handling incomplete batches
// - window sliding behavior
```

5. **Async Operations**

```typescript
const asyncFlow = flow(async function* () {
  yield await getValue(1)
  yield await getValue(2)
})

// Rate limiting
const rateLimited = flow(fetchUsers()).pipe(rateLimit(1000))

// Tests would verify:
// - handles async values
// - maintains timing between yields
// - proper error propagation
```

6. **Flow Combinations (concat, zip)**

```typescript
const combined = flow([1, 2]).pipe(concat(flow([3, 4])))

const zipped = flow([1, 2]).pipe(zip(flow(['a', 'b'])))
// Outputs: [1,'a'], [2,'b']

// Tests would verify:
// - correct order in combination
// - handling different lengths
// - sync/async mixing
```

7. **Reduction Operations**

```typescript
const sum = await flow([1, 2, 3]).reduce((acc, val) => acc + val, 0)

const collected = await flow([1, 2, 3]).collect()

// Tests would verify:
// - correct reduction
// - collect to array
// - handles async values
```

8. **Advanced Operations (flatten, groupBy)**

```typescript
const flattened = flow([
  [1, 2],
  [3, 4],
]).pipe(flatten())

const grouped = flow([
  { type: 'a', val: 1 },
  { type: 'b', val: 2 },
  { type: 'a', val: 3 },
]).pipe(groupBy((x) => x.type))

// Tests would verify:
// - proper flattening
// - grouping behavior
// - handling nested structures
```

For our TDD approach:

1. Start with basic Flow creation and iteration
2. Add simple transformations
3. Build up to more complex operations
4. Finally add async capabilities

Each feature would follow:

1. Write test describing behavior
2. Implement minimal code to pass
3. Refactor if needed
4. Move to next feature
