import express from 'express'
import { client } from '../connections/db_connection'

const router = express.Router()

function shouldSkipClickCount(userAgent: string | undefined) {
    if (!userAgent) {
        return false
    }

    const normalizedUserAgent = userAgent.toLowerCase()

    return [
        'googleimageproxy',
        'safelinks',
        'safe links',
        'crawler',
        'spider',
        'bot',
        'headless',
        'preview',
        'curl',
        'wget',
        'python-requests',
    ].some(pattern => normalizedUserAgent.includes(pattern))
}

router.get('/r/:code', async (req, res) => {
    const code = req.params.code

    if (!code) {
        return res.status(404).send('Not found')
    }

    const userAgent = req.get('user-agent')

    try {
        if (shouldSkipClickCount(userAgent)) {
            const lookup = await client.query(
                `select original_url
                 from redirect_links
                 where short_code = $1`,
                [code]
            )

            if (lookup.rowCount === 0) {
                return res.status(404).send('Not found')
            }

            return res.redirect(302, lookup.rows[0].original_url)
        }

        const update = await client.query(
            `update redirect_links
             set click_count = click_count + 1
             where short_code = $1
             returning original_url`,
            [code]
        )

        if (update.rowCount === 0) {
            return res.status(404).send('Not found')
        }

        return res.redirect(302, update.rows[0].original_url)
    } catch (error) {
        console.log(error)
        return res.status(500).send('Redirect failed')
    }
})

export default router