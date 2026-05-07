import dotenv from 'dotenv'

dotenv.config()

const redisHost = process.env.REDIS_HOST || '127.0.0.1'
const redisPort = Number(process.env.REDIS_PORT || 6379)
const redisUsername = process.env.REDIS_USERNAME || undefined
const redisPassword = process.env.REDIS_PASSWORD || undefined

export const connection = {
    username: redisUsername,
    password: redisPassword,
    host: redisHost,
    port: redisPort,
    retryStrategy: (times: number) => {
        if (times > 10) {
            console.error('Redis max reconnection attempts reached')
            return null
        }
        return Math.min(times * 100, 30000)
    }
}

console.log('Redis config:', {
    host: redisHost,
    port: redisPort,
    hasPassword: !!redisPassword
})


