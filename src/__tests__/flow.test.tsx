import { describe, expect, it } from 'vitest'
import { flow } from '../core/flow'

describe('flow', () => {
  it('should work with arrays', () => {
    const numbers = [1, 2, 3]
    const numberFlow = flow(numbers)

    const result = [...numberFlow]

    expect(result).toEqual([1, 2, 3])
  })

  it('should work with generators', () => {
    function* generator() {
      yield 1
      yield 2
      yield 3
    }

    const generatorFlow = flow(generator())

    const result = [...generatorFlow]

    expect(result).toEqual([1, 2, 3])
  })

  it('should be reusable', () => {
    const numbers = flow([1, 2, 3])

    const firstIteration = [...numbers]
    const secondIteration = [...numbers]

    expect(firstIteration).toEqual([1, 2, 3])
    expect(secondIteration).toEqual([1, 2, 3])
  })
})
