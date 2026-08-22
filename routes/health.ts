import express from 'express'
import { client } from '../connections/db_connection'
import { connection } from '../connections/reddis_connection'
import { logger } from '../utils/logger'

const router = express.Router()

router.get('/healthz', async (req, res) => {
  // If query ?format=badge is sent, return shields-compatible JSON
  const wantsBadge = req.query.format === 'badge'

  try {
    await client.query('SELECT 1')
    const pong = await connection.ping()
    const redisOk = pong === 'PONG'
    const healthy = redisOk

    if (wantsBadge) {
      return res.status(200).json({
        schemaVersion: 1,
        label: 'links.bhusalravi.com.np',
        message: healthy ? 'Currently Up and running' : 'Currently offline',
        color: healthy ? 'brightgreen' : 'red'
      })
    }

    return res.status(200).json({ status: 'ok', db: true, redis: redisOk })
  } catch (error) {
    logger.error({ error }, 'Healthcheck error')

    if (wantsBadge) {
      return res.status(200).json({
        schemaVersion: 1,
        label: 'links.bhusalravi.com.np',
        message: 'Currently offline',
        color: 'red'
      })
    }

    return res.status(500).json({ status: 'error' })
  }
})

export default router