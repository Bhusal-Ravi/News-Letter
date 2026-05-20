import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

const unsubscribeSecret = process.env.UNSUBSCRIBE_JWT_SECRET || process.env.JWT_SECRET || 'newsletter-unsubscribe-secret'

export function createUnsubscribeToken(email: string) {
    return jwt.sign({ email }, unsubscribeSecret, {
        expiresIn: '30d',
    })
}

export function createUnsubscribeLink(email: string) {
    const baseUrl = process.env.APP_URL || 'http://localhost:3000'
    const token = createUnsubscribeToken(email)

    return `${baseUrl}/api/unsubscribe?token=${encodeURIComponent(token)}`
}

export function verifyUnsubscribeToken(token: string) {
    const payload = jwt.verify(token, unsubscribeSecret) as jwt.JwtPayload

    if (!payload.email || typeof payload.email !== 'string') {
        throw new Error('Invalid unsubscribe token payload')
    }

    return {
        email: payload.email,
    }
}