import dotenv from 'dotenv'
import { client  } from '../connections/db_connection'
import { startWebSearch } from '../queues/web_search_queue'
import { Rss_Clean_Table } from '../Types/Api_Types'
dotenv.config()


export async function webSearch(){
    const db= await client.connect()
    try{
        const data= await db.query(`select * from temp_rank_table `)
        
        if(data.rowCount===0) {
            console.log("Nothing available in temp_rank_table to do the webSearch")
        }

        console.log(`Initiating WebSearch for ${data.rowCount} Articles `)

        startWebSearch(data.rows)

    }catch(error){
        console.log(error)
    }
}

webSearch()