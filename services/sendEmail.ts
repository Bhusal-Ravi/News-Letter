import dotenv from 'dotenv'
import { client } from '../connections/db_connection'
import { Final_Rank_Table } from '../Types/Api_Types'
import { startSendEmail } from '../queues/email_queue'
import { logger } from '../utils/logger'
dotenv.config()



export async function sendEmail(){
    let db= await client.connect()
    try{
        const get= await db.query(`select * from final_rank_table where created_at::date= now()::date and sent=false `)
        if(get.rowCount===0){
             throw new Error("No news available in the final_rank_table")
        }

      await startSendEmail(get.rows)

    }catch(error){
        logger.error({ error })
        throw error
    }finally{
        db.release()
    }
}

