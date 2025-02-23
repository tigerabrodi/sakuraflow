import { flow } from '../core/flow'
import { sleep } from '../lib/utils'
import { map } from '../operators/transform'

describe('async operations', () => {
  it('should work with async iterables', async () => {
    async function* asyncSource() {
      yield 1
      yield 2
      yield 3
    }

    const numbers = flow(asyncSource())
    const result = []

    for await (const value of numbers) {
      result.push(value)
    }

    expect(result).toEqual([1, 2, 3])
  })

  it('should work with async transformations', async () => {
    const numbers = flow([1, 2, 3]).pipe(map(async (x) => x * 2))

    const result = []
    for await (const value of numbers) {
      result.push(value)
    }

    expect(result).toEqual([2, 4, 6])
  })

  it('should maintain order with async operations', async () => {
    const numbers = flow([1, 2, 3]).pipe(
      map(async (x) => {
        await sleep(Math.random() * 100)
        return x * 2
      })
    )

    const result = []
    for await (const value of numbers) {
      result.push(value)
    }

    expect(result).toEqual([2, 4, 6])
  })
})
