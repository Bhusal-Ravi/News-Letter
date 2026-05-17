import dotenv from 'dotenv'
import { client  } from '../connections/db_connection'
import { startWebSearch } from '../queues/web_search_queue'
import { Rss_Clean_Table } from '../Types/Api_Types'
import { startLlmSummarization } from '../queues/llm_generate_queue'

dotenv.config()



export async  function llmSummarize(){
    let db= await client.connect()
    try{
        const query= `select * from temp_rank_table`
        const get= await db.query(query)
        if(get.rowCount===0) {
            console.log("The temp_rank_table is empty to generate any llm response ")
            return
        }
       
        console.log('Started Llm summarization')
        startLlmSummarization(get.rows)

    }catch(error){
        console.log(error)
    }
}


llmSummarize()