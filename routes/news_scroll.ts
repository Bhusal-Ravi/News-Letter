import express from 'express'
import { client } from '../connections/db_connection'
import { logger } from '../utils/logger'

const router = express.Router()

router.post('/scroll', async (req,res)=>{
    let db= await  client.connect()
    let limit:number=10
    let offset:number=req.body.offset || 0
    if(offset%10!==0) throw new Error('Wrong Offset Provided')
    
    try{        
            let news= await db.query(`select * from final_rank_table
                                      order by created_at desc
                                      limit $1
                                      offset $2`,[limit,offset])

            if(news.rowCount===0){
                return res.status(200).json({message:'End of News'})
            }

            return res.status(200).json({message:'News Loaded',data:news.rows})
            
    }catch(error){
        logger.error({error},'Scroll Error')
    }finally{
         db.release()
    }
})

export default router