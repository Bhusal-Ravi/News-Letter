import dotenv from 'dotenv'
import crypto from 'crypto'
import { client } from '../connections/db_connection'

dotenv.config()

const redirectBaseUrl = process.env.LINKS_APP_URL || 'https://links.bhusalravi.com.np'
const redirectAttempts = 5

function isValidRedirectUrl(originalUrl: string) {
    try {
        const parsedUrl = new URL(originalUrl.trim())

        return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
    } catch (error) {
        return false
    }
}

function createShortCode() {
    return crypto.randomBytes(6).toString('hex')
}

export async function createRedirectLink(originalUrl: string) {
    const trimmedUrl = originalUrl.trim()

    if (!isValidRedirectUrl(trimmedUrl)) {
        throw new Error('Invalid redirect url')
    }

    for (let attempt = 0; attempt < redirectAttempts; attempt++) {
        const shortCode = createShortCode()

        const insert = await client.query(
            `insert into redirect_links (short_code, original_url)
             values ($1, $2)
             on conflict (short_code) do nothing
             returning short_code`,
            [shortCode, trimmedUrl]
        )

        if (insert.rowCount === 1) {
            return `${redirectBaseUrl}/r/${shortCode}`
        }
    }

    throw new Error('Failed to create redirect link')
}