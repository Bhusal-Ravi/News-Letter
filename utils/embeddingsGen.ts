
import { client } from '../connections/vogaye_connection'
import { logger } from './logger'




export async function getEmbedding(text:string) {
  try{
    const res = await client.embed({
      input:text,
      model:'voyage-4-lite',
      outputDimension:1024
  })
 
    return res.data?.[0]?.embedding
  
  }catch(error){
    logger.error({ error })
  }
  
  
}




