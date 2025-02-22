import { flow } from '../core/flow'
import { filter, map } from '../operators/transform'

describe('transform', () => {
  describe('map', () => {
    it('should transform values using map', () => {
      const numbers = flow([1, 2, 3]).pipe(map((x) => x * 2))

      const result = [...numbers]

      expect(result).toEqual([2, 4, 6])
    })

    it('should be composable with multiple operations', () => {
      const numbers = flow([1, 2, 3]).pipe(
        map((x) => x * 2),
        map((x) => x + 1)
      )

      const result = [...numbers]

      expect(result).toEqual([3, 5, 7])
    })

    it('should maintain types through transformations', () => {
      const numbers = flow([1, 2, 3]).pipe(
        map((x) => x.toString()),
        map((x) => x.length)
      )

      const result = [...numbers]

      expect(result).toEqual([1, 1, 1])
    })
  })

  describe('filter', () => {
    it('should filter values based on predicate', () => {
      const numbers = flow([1, 2, 3, 4]).pipe(filter((x) => x % 2 === 0))

      const result = [...numbers]

      expect(result).toEqual([2, 4])
    })

    it('should work with map in composition', () => {
      const numbers = flow([1, 2, 3, 4]).pipe(
        map((x) => x * 2),
        filter((x) => x > 4)
      )

      const result = [...numbers]

      expect(result).toEqual([6, 8])
    })

    it('should maintain types through filtering', () => {
      const items = flow(['a', '', 'b', '', 'c']).pipe(
        filter((x) => x !== ''),
        map((x) => x.toUpperCase())
      )

      const result = [...items]

      expect(result).toEqual(['A', 'B', 'C'])
    })
  })
})
