Remaining potential scope:

**Reduction Operations**

```typescript
const sum = await flow([1, 2, 3]).reduce((acc, val) => acc + val, 0)

const collected = await flow([1, 2, 3]).collect()

// Tests would verify:
// - correct reduction
// - collect to array
// - handles async values
```

**Advanced Operations (flatten, groupBy)**

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
