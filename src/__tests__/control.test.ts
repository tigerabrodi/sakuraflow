import { flow } from '../core/flow'
import { skip, take, takeWhile } from '../operators/control'
import { map } from '../operators/transform'

describe('control operators', () => {
  describe('take', () => {
    it('should take first n items', () => {
      const numbers = flow([1, 2, 3, 4, 5]).pipe(take(3))

      const result = [...numbers]
      expect(result).toEqual([1, 2, 3])
    })

    it('should work with other operators', () => {
      const numbers = flow([1, 2, 3, 4, 5]).pipe(
        map((x) => x * 2),
        take(2)
      )

      const result = [...numbers]
      expect(result).toEqual([2, 4])
    })

    it('should handle taking more than available', () => {
      const numbers = flow([1, 2]).pipe(take(5))

      const result = [...numbers]
      expect(result).toEqual([1, 2])
    })
  })

  describe('skip', () => {
    it('should skip first n items', () => {
      const numbers = flow([1, 2, 3, 4, 5]).pipe(skip(2))

      const result = [...numbers]
      expect(result).toEqual([3, 4, 5])
    })

    it('should work with other operators', () => {
      const numbers = flow([1, 2, 3, 4, 5]).pipe(
        skip(2),
        map((x) => x * 2)
      )

      const result = [...numbers]
      expect(result).toEqual([6, 8, 10])
    })

    it('should handle skipping more than available', () => {
      const numbers = flow([1, 2, 3]).pipe(skip(5))

      const result = [...numbers]
      expect(result).toEqual([])
    })
  })

  describe('takeWhile', () => {
    it('should take items while predicate is true', () => {
      const numbers = flow([1, 2, 3, 6, 8, 2]).pipe(takeWhile((x) => x < 5))

      const result = [...numbers]
      expect(result).toEqual([1, 2, 3])
    })

    it('should work with other operators', () => {
      const numbers = flow([1, 2, 3, 4, 5]).pipe(
        map((x) => x * 2),
        takeWhile((x) => x <= 6)
      )

      const result = [...numbers]
      expect(result).toEqual([2, 4, 6])
    })

    it('should handle empty source', () => {
      const numbers = flow([]).pipe(takeWhile((x) => x < 5))

      const result = [...numbers]
      expect(result).toEqual([])
    })

    it('should handle always-false predicate', () => {
      const numbers = flow([1, 2, 3]).pipe(takeWhile(() => false))

      const result = [...numbers]
      expect(result).toEqual([])
    })
  })
})
