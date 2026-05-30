import pino from 'pino'
import dotenv from 'dotenv'

dotenv.config()

const targets: Array<any> = []

if (process.env.BETTER_STACK_TOKEN) {
    targets.push({
        target: '@logtail/pino',
        options: { sourceToken: process.env.BETTER_STACK_TOKEN },
    })
}

targets.push({ target: 'pino-pretty' })

const transport = pino.transport({ targets })

export const logger = pino({ level: process.env.LOG_LEVEL ?? 'info' }, transport)
