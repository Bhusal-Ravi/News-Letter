
import { client } from '../connections/vogaye_connection'




export async function getEmbedding(text:string) {
  try{
    const res = await client.embed({
      input:text,
      model:'voyage-4-lite',
      outputDimension:1024
  })
 
    return res.data?.[0]?.embedding
  
  }catch(error){
    console.log(error)
  }
  
  
}

