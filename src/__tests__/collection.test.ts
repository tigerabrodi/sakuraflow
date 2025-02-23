import { flow } from '../core/flow'
import { batch, window } from '../operators/collection'
import { map } from '../operators/transform'

describe('collection operators', () => {
  describe('batch', () => {
    it('should group items into batches of specified size', () => {
      const numbers = flow([1, 2, 3, 4, 5]).pipe(batch(2))

      const result = [...numbers]
      expect(result).toEqual([[1, 2], [3, 4], [5]])
    })

    it('should work with other operators', () => {
      const numbers = flow([1, 2, 3, 4]).pipe(
        map((x) => x * 2),
        batch(2),
        map((batch) => batch.reduce((a, b) => a + b))
      )

      const result = [...numbers]
      expect(result).toEqual([6, 14]) // [2,4] -> 6, [6,8] -> 14
    })

    it('should handle empty source', () => {
      const numbers = flow([]).pipe(batch(2))

      const result = [...numbers]
      expect(result).toEqual([])
    })

    it('should handle batch size of 1', () => {
      const numbers = flow([1, 2, 3]).pipe(batch(1))

      const result = [...numbers]
      expect(result).toEqual([[1], [2], [3]])
    })
  })

  describe('window', () => {
    it('should create sliding windows of specified size', () => {
      const numbers = flow([1, 2, 3, 4, 5]).pipe(window(3))

      const result = [...numbers]
      expect(result).toEqual([
        [1, 2, 3],
        [2, 3, 4],
        [3, 4, 5],
      ])
    })

    it('should work with other operators', () => {
      const numbers = flow([1, 2, 3, 4, 5]).pipe(
        window(3),
        map((win) => win.reduce((a, b) => a + b) / win.length) // moving average
      )

      const result = [...numbers]
      expect(result).toEqual([2, 3, 4]) // avg of [1,2,3], [2,3,4], [3,4,5]
    })

    it('should handle window size larger than source', () => {
      const numbers = flow([1, 2]).pipe(window(3))

      const result = [...numbers]
      expect(result).toEqual([])
    })

    it('should handle window size of 1', () => {
      const numbers = flow([1, 2, 3]).pipe(window(1))

      const result = [...numbers]
      expect(result).toEqual([[1], [2], [3]])
    })
  })
})
