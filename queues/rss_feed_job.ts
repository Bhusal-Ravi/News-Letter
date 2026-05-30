import { Queue, Worker } from 'bullmq'
import { connection } from '../connections/reddis_connection'
import { createEmbedding, handleRssFeed, physicalDedupe } from '../services/rssFeed'
import { logger } from '../utils/logger'

const FLOW_BAR = '----------------------------------------'

const RssQueue = new Queue('news', { connection })
const RssWorker = new Worker('news', async job => {
    logger.info(`[RSS/WORKER] ${FLOW_BAR}`)
    logger.info(`[RSS/WORKER] Started job: ${job.name} (id: ${job.id})`)
    const sources: string[] = job.data.sources
    const category = job.name
    logger.info(`[RSS/WORKER] Category: ${category}, sources: ${sources.length}`)
    logger.info({ sources }, '[RSS/WORKER] Source list')
    const structuredWorldNews = await handleRssFeed(sources, category);
    const newStructuredWorldNews = await physicalDedupe(structuredWorldNews)
    logger.info({ articles: newStructuredWorldNews }, '[RSS/WORKER] Structured news')
    await createEmbedding(newStructuredWorldNews)

    logger.info(`[RSS/WORKER] Completed job: ${job.name} (id: ${job.id}) with ${newStructuredWorldNews.length} deduped articles`)

}, { connection })

export async function closeRssFeedResources() {
    await Promise.all([
        RssWorker.close(),
        RssQueue.close(),
    ])
}



export async function pullRssFeed() {
    try {
        logger.info(`[RSS/PUBLISHER] ${FLOW_BAR}`)
        logger.info('[RSS/PUBLISHER] Queueing worldnews and technews pull jobs')
        RssQueue.add('worldnews', {
            sources: ['https://www.aljazeera.com/xml/rss/all.xml',
                'http://feeds.bbci.co.uk/news/world/rss.xml',
                'https://www.ft.com/world?format=rss',
                'https://rss.nytimes.com/services/xml/rss/nyt/World.xml']
        })

        RssQueue.add('technews', {
            sources: [

                'https://feeds.arstechnica.com/arstechnica/index',
                'https://hnrss.org/frontpage'



            ]
        })
    } catch (error) {
        logger.error({ error }, '[RSS/PUBLISHER][ERROR]')
    }
}

