import pg from 'pg'
import dotenv from 'dotenv'
import { logger } from '../utils/logger'
dotenv.config()

const { Pool, Client } = pg

export const client = new Pool({
  max: 30
})

client.query('SELECT NOW()', (err, res) => {
  if (err) {
    logger.error({ error: err }, 'Db connection check failed')
    return
  }

  logger.info('Db connected successfully')
})