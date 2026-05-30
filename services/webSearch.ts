import dotenv from 'dotenv'
import { client } from '../connections/db_connection'
import { startWebSearch } from '../queues/web_search_queue'
import { Rss_Clean_Table } from '../Types/Api_Types'
import { logger } from '../utils/logger'
dotenv.config()


export async function webSearch() {
    const db = await client.connect()
    try {
        const data = await db.query(`select * from temp_rank_table `)

        if (data.rowCount === 0) {
            logger.warn('Nothing available in temp_rank_table to do the webSearch')
            return
        }

        logger.info(`Initiating WebSearch for ${data.rowCount} Articles `)

        await startWebSearch(data.rows)

    } catch (error) {
        logger.error({ error }, '[WEBSEARCH][ERROR]')
    } finally {
        db.release()
    }
}

