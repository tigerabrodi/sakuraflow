import { flow } from '../core/flow'
import { map } from '../operators/transform'

describe('transform', () => {
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
