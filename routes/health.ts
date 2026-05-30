import express from 'express'
import { client } from '../connections/db_connection'
import { connection } from '../connections/reddis_connection'
import { logger } from '../utils/logger'

const router = express.Router()

router.get('/healthz', async (req, res) => {
  try {
    await client.query('SELECT 1')
    const pong = await connection.ping()
    res.status(200).json({ status: 'ok', db: true, redis: pong === 'PONG' })
  } catch (error) {
    logger.error({ error }, 'Healthcheck error')
    res.status(500).json({ status: 'error' })
  }
})

export default router
