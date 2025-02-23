import { flow } from '../core/flow'
import { concat, zip } from '../operators/combine'
import { map } from '../operators/transform'

describe('combine operators', () => {
  describe('concat', () => {
    it('should combine two flows in order', () => {
      const numbers = flow([1, 2]).pipe(concat(flow([3, 4])))

      const result = [...numbers]
      expect(result).toEqual([1, 2, 3, 4])
    })

    it('should work with more than two flows', () => {
      const numbers = flow([1]).pipe(concat(flow([2]), flow([3])))

      const result = [...numbers]
      expect(result).toEqual([1, 2, 3])
    })

    it('should handle empty flows', () => {
      const numbers = flow([]).pipe(concat(flow([1, 2])))

      const result = [...numbers]
      expect(result).toEqual([1, 2])
    })

    it('should work with transformations', () => {
      const numbers = flow([1, 2]).pipe(
        map((x) => x * 2),
        concat(flow([5, 6])),
        map((x) => x + 1)
      )

      const result = [...numbers]
      expect(result).toEqual([3, 5, 6, 7])
    })
  })

  describe('zip', () => {
    it.only('should combine values from two flows', () => {
      const numbers = flow([1, 2]).pipe(zip(flow(['a', 'b'])))

      const result = [...numbers]
      expect(result).toEqual([
        [1, 'a'],
        [2, 'b'],
      ])
    })

    it('should stop at shortest flow', () => {
      const numbers = flow([1, 2, 3]).pipe(zip(flow(['a', 'b'])))

      const result = [...numbers]
      expect(result).toEqual([
        [1, 'a'],
        [2, 'b'],
      ])
    })

    it('should work with transformations', () => {
      const numbers = flow([1, 2]).pipe(
        map((x) => x * 2),
        zip(flow(['a', 'b'])),
        map(([num, str]) => `${str}${num}`)
      )

      const result = [...numbers]
      expect(result).toEqual(['a2', 'b4'])
    })

    it('should handle empty flows', () => {
      const numbers = flow([1, 2]).pipe(zip(flow([])))

      const result = [...numbers]
      expect(result).toEqual([])
    })

    it('should work with async flows', async () => {
      async function* asyncSource() {
        yield 'a'
        yield 'b'
      }

      const numbers = flow([1, 2]).pipe(zip(flow(asyncSource())))

      const result = []
      for await (const value of numbers) {
        result.push(value)
      }

      expect(result).toEqual([
        [1, 'a'],
        [2, 'b'],
      ])
    })
  })
})
