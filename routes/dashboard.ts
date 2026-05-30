import express from 'express'
import { client } from '../connections/db_connection'
import { logger } from '../utils/logger'

const router = express.Router()

router.get('/api/dashboard/subscribed-users', async (_req, res) => {
  try {
    const result = await client.query(
      `select coalesce(total_users, 0)::int as total_users from subscribed_users`
    )

    return res.status(200).json(result.rows[0] ?? { total_users: 0 })
  } catch (error) {
    logger.error({ error }, '[DASHBOARD][SUBSCRIBED_USERS]')
    return res.status(500).json({ error: 'Failed to fetch subscribed users.' })
  }
})

router.get('/api/dashboard/news-category', async (_req, res) => {
  try {
    const result = await client.query(
      `select category, articles_per_tag from news_category`
    )

    return res.status(200).json(result.rows)
  } catch (error) {
    logger.error({ error }, '[DASHBOARD][NEWS_CATEGORY]')
    return res.status(500).json({ error: 'Failed to fetch news category data.' })
  }
})

router.get('/api/dashboard/total-articles-fetched-today', async (_req, res) => {
  try {
    const result = await client.query(
      `select total::int as total, category from total_articles_fetched_today`
    )

    return res.status(200).json(result.rows)
  } catch (error) {
    logger.error({ error }, '[DASHBOARD][FETCHED_TODAY]')
    return res.status(500).json({ error: 'Failed to fetch fetched-articles totals.' })
  }
})

router.get('/api/dashboard/total-articles-sent', async (_req, res) => {
  try {
    const result = await client.query(
      `select total::int as total, category from total_articles_sent`
    )

    return res.status(200).json(result.rows)
  } catch (error) {
    logger.error({ error }, '[DASHBOARD][TOTAL_SENT]')
    return res.status(500).json({ error: 'Failed to fetch sent-articles totals.' })
  }
})

router.get('/api/dashboard', async (_req, res) => {
  try {
    const [subscribedUsers, newsCategory, fetchedToday, totalSent] = await Promise.all([
      client.query(`select coalesce(total_users, 0)::int as total_users from subscribed_users`),
      client.query(`select category, articles_per_tag from news_category`),
      client.query(`select total::int as total, category from total_articles_fetched_today`),
      client.query(`select total::int as total, category from total_articles_sent`),
    ])

    return res.status(200).json({
      subscribed_users: subscribedUsers.rows[0] ?? { total_users: 0 },
      news_category: newsCategory.rows,
      total_articles_fetched_today: fetchedToday.rows,
      total_articles_sent: totalSent.rows,
    })
  } catch (error) {
    logger.error({ error }, '[DASHBOARD][AGGREGATE]')
    return res.status(500).json({ error: 'Failed to fetch dashboard data.' })
  }
})

export default router
