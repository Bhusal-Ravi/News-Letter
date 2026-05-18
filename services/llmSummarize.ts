import dotenv from 'dotenv'
import { client } from '../connections/db_connection'
import { startWebSearch } from '../queues/web_search_queue'
import { Rss_Clean_Table } from '../Types/Api_Types'
import { startLlmSummarization } from '../queues/llm_generate_queue'

dotenv.config()



export async function llmSummarize(guid: string) {
    let db = await client.connect()
    try {
        const query = `UPDATE temp_rank_table 
       SET llm_queued = TRUE 
       WHERE guid = $1 AND llm_queued = FALSE
       RETURNING *`
        const get = await db.query(query, [guid])
        if (get.rowCount === 0) {
            console.log("Already queued or not found for Llm summarization ")
            return
        }

        console.log('Started Llm summarization')
        await startLlmSummarization(get.rows)

    } catch (error) {
        console.error('[LLM/SUMMARIZE][ERROR]', error)
    } finally {
        db.release()
    }
}


