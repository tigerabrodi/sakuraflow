import { flow } from '../core/flow'
import type { Flow, Operation } from '../core/types'
import { sleep } from '../lib/utils'

/**
 * Creates an operation that limits the rate at which values are emitted from the flow.
 * Ensures a minimum time interval between each value.
 *
 * @param msBetweenYield - The minimum number of milliseconds to wait between yielding values
 *
 * @example
 * ```ts
 * const numbers = flow([1, 2, 3]).pipe(
 *   rateLimit(1000) // Emit one value per second
 * )
 *
 * for await (const num of numbers) {
 *   console.log(num) // Logs 1, 2, 3 with 1 second delay between each
 * }
 * ```
 */
export function rateLimit<TValue>(
  msBetweenYield: number
): Operation<TValue, TValue> {
  return (flowInput: Flow<TValue>): Flow<TValue> => {
    async function* rateLimitGenerator() {
      let lastYield = 0

      for await (const value of flowInput) {
        const now = Date.now()
        const timeElapsedSinceLastYield = now - lastYield
        const timeUntilNextYield = msBetweenYield - timeElapsedSinceLastYield
        const hasAnyTimeToWait = timeUntilNextYield > 0

        if (hasAnyTimeToWait) {
          await sleep(timeUntilNextYield)
        }

        yield value
        lastYield = Date.now()
      }
    }

    return flow(rateLimitGenerator())
  }
}
