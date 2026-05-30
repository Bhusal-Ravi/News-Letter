import express from 'express'
import { client } from '../connections/db_connection'
import { logger } from '../utils/logger'

const router = express.Router()

router.get('/api/usersnumber', async (_req, res) => {
	try {
		const result = await client.query(
			`select count(distinct email)::int as count from users where subscribed=true`
		)

		const count = result.rows[0]?.count ?? 0

		return res.status(200).json({ count })
	} catch (error) {
		logger.error({ error }, '[USERS NUMBER]')
		return res.status(500).json({ error: 'Failed to fetch subscriber count.' })
	}
})

export default router