import express from 'express'
import { client } from '../connections/db_connection'

const router = express.Router()

router.get('/api/usersnumber', async (_req, res) => {
	try {
		const result = await client.query(
			`select count(distinct email)::int as count from users`
		)

		const count = result.rows[0]?.count ?? 0

		return res.status(200).json({ count })
	} catch (error) {
		console.error('[USERS NUMBER]', error)
		return res.status(500).json({ error: 'Failed to fetch subscriber count.' })
	}
})

export default router