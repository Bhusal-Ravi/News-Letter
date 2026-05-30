import { Queue, Worker } from 'bullmq'
import { connection } from '../connections/reddis_connection'
import { client } from '../connections/vogaye_connection'
import { insertIntoCleanTable } from '../sql/insert_into_clean_table'
import { Rss_Clean_Table, Rss_Clean_Table_Embedding } from '../Types/Api_Types'
import { logger } from '../utils/logger'

const FLOW_BAR = '----------------------------------------'

export const EmbeddingQueue = new Queue('embedding', { connection })
const EmbeddingWorker = new Worker ('embedding',async job=>{
    const text= job.data.text
    const newStructuredWorldNews:Rss_Clean_Table[] = job.data.newStructuredWorldNews
  try{
      logger.info(`[EMBED/WORKER] ${FLOW_BAR}`)
      logger.info(`[EMBED/WORKER] Started embedding job: ${job.name} (id: ${job.id}) with ${text.length} items`)
      logger.info({ titles: newStructuredWorldNews.map(item => item.title) }, '[EMBED/WORKER] Embedding titles')
         if(text.length!==0) {
           var result= await client.embed({
                               input:text,
                               model:'voyage-4-lite',
                               
                           })
                           
   
           
           const newsWithEmbeddings:Rss_Clean_Table_Embedding[]= newStructuredWorldNews.map((item,index)=>({
               ...item,
               embedding: result?.data?.[index].embedding
           }))
   
            // Insert into Db
             await  insertIntoCleanTable(newsWithEmbeddings)
             logger.info(`[EMBED/WORKER] Embedding generation and DB insert completed for ${newsWithEmbeddings.length} articles`)
             }else {
               logger.warn('[EMBED/WORKER] Nothing to insert into db')
             }

  }catch(error){
        logger.error({ error }, '[EMBED/WORKER][ERROR]')
        throw error
    }
  
   
},
{
 connection,
  limiter:{
         max: 1,
        duration: 1000*60,
    }
 
})

    export async function closeEmbeddingResources() {
      await Promise.all([
        EmbeddingWorker.close(),
        EmbeddingQueue.close(),
      ])
    }


