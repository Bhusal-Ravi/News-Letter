import express from 'express'
import { client } from '../connections/db_connection'
import { verifyUnsubscribeToken } from '../utils/unsubscribeToken'

const router = express.Router()

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

router.post('/subscribe', async (req, res) => {
	const email =
		typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : ''

	if (!email || !EMAIL_RE.test(email)) {
		return res.status(400).json({ error: 'Please enter a valid email address.' })
	}

	try {
		const db = await client.connect()

		try {
			const existing = await db.query(
				`select subscribed from users where email = $1`,
				[email]
			)

			if (existing.rowCount && existing.rowCount > 0) {
				if (existing.rows[0].subscribed) {
					return res.status(200).json({ message: 'You are already subscribed.' })
				}

				await db.query(
					`update users set subscribed = true, updated_at = now() where email = $1`,
					[email]
				)

				return res.status(200).json({ message: 'Welcome back — you are subscribed again.' })
			}

			await db.query(
				`insert into users (email, subscribed) values ($1, true)`,
				[email]
			)

			return res.status(201).json({ message: 'You are subscribed. Check your inbox tomorrow.' })
		} finally {
			db.release()
		}
	} catch (error) {
		console.error('[SUBSCRIBE]', error)
		return res.status(500).json({ error: 'Something went wrong. Please try again.' })
	}
})

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
