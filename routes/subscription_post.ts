import express from 'express'
import { client } from '../connections/db_connection'
import { verifyUnsubscribeToken } from '../utils/unsubscribeToken'

const router = express.Router()

router.post('/unsubscribe', async (req, res) => {
	const token =
		(typeof req.query.token === 'string' && req.query.token) ||
		(typeof req.body?.token === 'string' && req.body.token)

	if (!token) {
		return res.status(200).send('OK')
	}

	try {
		const payload = verifyUnsubscribeToken(token)

		const db = await client.connect()

		try {
			await db.query(
				`
				update users
				set subscribed = $1
				where email = $2
				`,
				[false, payload.email]
			)

			return res.status(200).send('OK')
		} finally {
			db.release()
		}
	} catch (error) {
		console.log(error)

		
		return res.status(200).send('OK')
	}
})

export default router