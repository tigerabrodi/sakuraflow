// This is a helper type to create a tuple of a given length
// How does it work?
// Length is a number, it's what you pass when doing BuildTuple<5>
// The second generic is optional, it's for ourselves actually
// We start with a number and an empty array
// We check the result length, if it is not equal to the length, we recurse
// We recurse by adding one to the array and checking again
// The idea is to build an array of unknown values of the given length
// Eventually, you can do BuildTuple<5>["length"] and get 5
export type BuildTuple<
  Length extends number,
  Result extends Array<unknown> = [],
> = Result['length'] extends Length
  ? Result
  : BuildTuple<Length, [...Result, unknown]>

// This is a helper type to subtract SubtractAmount from Value e.g. Subtract<5, 3> = 2
// How does it work?
// We build a tuple of the value first e.g. BuildTuple<5> = [unknown, unknown, unknown, unknown, unknown]
// Then we check if the tuple of the subtract amount can be fit into the value tuple
// If it can not, it means the subtraction is not possible because SubtractAmount is greater than Value which this doesn't support
// So we essentially Build a tuple of the SubtractAmount, we spread it into the the tuple and when we do `...infer Rest`, we get the rest of the tuple which is the reamining piece of the value tuple
// e.g. 5 - 3 = BuildTuple<5> extends [...BuildTuple<3> = [unknown, unknown, unknown], ...infer Rest] ? [unknown, unknown]['length'] : never
export type Subtract<Value extends number, SubtractAmount extends number> =
  BuildTuple<Value> extends [...BuildTuple<SubtractAmount>, ...infer Rest]
    ? Rest['length']
    : never

// We simply access the length property of the array
export type Length<T extends Array<unknown>> = T['length']

// We get the last element of the array
// We do so by inferring the last element and then returning it
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Last<T extends Array<unknown>> = T extends [...infer _, infer Last]
  ? Last
  : never

export type Zero = 0
export type One = 1
