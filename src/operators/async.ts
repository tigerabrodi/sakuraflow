import { flow } from '../core/flow'
import type { Flow, Operation } from '../core/types'
import { sleep } from '../lib/utils'

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
