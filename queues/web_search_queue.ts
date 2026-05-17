import { Queue, Worker } from 'bullmq'
import { connection } from '../connections/reddis_connection'
import { client } from '../connections/db_connection'

import { Rss_Clean_Table } from '../Types/Api_Types'
import { tvly } from '../connections/tavily_connection'




const WebSearchQueue = new Queue('websearch', { connection })
const WebSearchWorker = new Worker ('websearch',async job=>{
    let db= await client.connect()
    try{

        const   data:Rss_Clean_Table= job.data
    const response= await tvly.search(data.title.concat(","),{
    searchDepth: "basic",
    maxResults: 3,
    includeImages: true,
    chunksPerSource: 5,
    excludeDomains: [
        "https://www.wikipedia.org"
        ]
    }) 

    let content="";

    for(let item of response.results){
        content=content.concat(",",item.content)
    }

    

    const image_url=response?.images?.[0].url

    const query=`update temp_rank_table
                 set content=$1,
                     image_url=$2
                 where guid=$3`
                 
    const insert= await db.query(query,[content,image_url,data.guid])

    return {
        rowCount: insert.rowCount,
        content:content,
        image:image_url
    }


    }catch(error){
        console.log(error)
    }finally{
        db.release()
    }
    
},{ connection,
    limiter:{
        max: 15,
        duration: 60 * 1000 ,
    },
    
})

    export async function closeWebSearchResources() {
        await Promise.all([
            WebSearchWorker.close(),
            WebSearchQueue.close(),
        ])
    }

WebSearchWorker.on('completed', async(job,data)=>{
        console.log('RowCount',data.rowCount,'\n')
        console.log('content',data.content,'\n')
        console.log('image',data.image,'\n')
})



export async function startWebSearch(data:Rss_Clean_Table[]){

    if(!data){
        console.log("No data to start webSearch")
        return
    }

    for(let item of data){
        WebSearchQueue.add('temp_content',item)
    }


}