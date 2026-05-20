import express from 'express'
import { client } from '../connections/db_connection'
import { verifyUnsubscribeToken } from '../utils/unsubscribeToken'

const router = express.Router()

router.get('/unsubscribe', async (req, res) => {
	const token = req.query.token

	if (!token || typeof token !== 'string') {
		return res.status(400).send('Invalid unsubscribe request')
	}

	try {
		const payload = verifyUnsubscribeToken(token)
		const db = await client.connect()

		try {
			const update = await db.query(
				`update users
                set subscribed=false
                where email=$1`,
				[ payload.email]
			)

			

			return res.status(200).send('OK')
		} finally {
			db.release()
		}
	} catch (error) {
		console.log(error)
		return res.status(400).send('Invalid or expired unsubscribe token')
	}
})

export default router
