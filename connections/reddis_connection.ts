import dotenv from 'dotenv'
import IORedis from 'ioredis'
import { logger } from '../utils/logger'

dotenv.config()

const redisHost = process.env.REDIS_HOST || '127.0.0.1'
const redisPort = Number(process.env.REDIS_PORT || 6379)
const redisUsername = process.env.REDIS_USERNAME || undefined
const redisPassword = process.env.REDIS_PASSWORD || undefined

// Shared ioredis instance — Queues reuse this directly,
// Workers will call .duplicate() internally for their blocking client.
export const connection = new IORedis({
    username: redisUsername,
    password: redisPassword,
    host: redisHost,
    port: redisPort,
    maxRetriesPerRequest: null,   // required by BullMQ
    retryStrategy: (times: number) => {
        if (times > 10) {
            logger.error('Redis max reconnection attempts reached')
            return null
        }
        return Math.min(times * 100, 30000)
    }
})

logger.info('Redis config:')
logger.info({
    host: redisHost,
    port: redisPort,
    hasPassword: !!redisPassword
})
