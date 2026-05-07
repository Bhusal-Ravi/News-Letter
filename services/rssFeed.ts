import Parser from 'rss-parser'
import { Rss_Clean_Table, Rss_Clean_Table_Embedding, Rss_Feed_Type } from '../Types/Api_Types'

import { client  as db_client } from '../connections/db_connection'

import { EmbeddingQueue } from '../queues/embedding_queue'

const FLOW_BAR = '----------------------------------------'

type CustomFeed= {
    foo:string
}

type CustomItem= {
    bar:number
}

const parser:Parser<CustomFeed,CustomItem>= new Parser({
      customFields: {
    feed: ['foo'],
            
    item: ['bar']
  }
})


// const worldNewsUrl=['https://www.aljazeera.com/xml/rss/all.xml',
//                     'http://feeds.bbci.co.uk/news/world/rss.xml',
//                     'https://www.ft.com/world?format=rss',
//                     'https://rss.nytimes.com/services/xml/rss/nyt/World.xml'
                    
                    
//                   ]


export async function handleRssFeed(sources:string[],category:string){
    let db
    try{
        db=await db_client.connect()
        const worldNewsArray= await Promise.all(
            
            sources.map((url)=>parser.parseURL(url)) 
           
        )
       
        const worldNews:Rss_Feed_Type[]= worldNewsArray.flatMap((news)=>news.items) as Rss_Feed_Type[]
        let structuredWorldNews:Rss_Clean_Table[]= worldNews.map((news)=>(
            {
                title:news.title,
                source:news.link,
                content:news.content.trim(),
                published_date:news.isoDate,
                guid:news.guid,
                category:category
            }

        ))

        console.log(`[RSS/FETCH] ${FLOW_BAR}`)
        console.log('[RSS/FETCH] Feed fetch completed and structured format created')

        structuredWorldNews = structuredWorldNews.filter((item) => item.guid != null && item.guid !== "")

        return structuredWorldNews
        


       

    }catch(error){
        console.log('[RSS/FETCH][ERROR]', error)
        throw error
    }finally{
        db?.release()
    }
}



export async function physicalDedupe(structuredWorldNews:Rss_Clean_Table[]){
    let db
    try{
        db=await db_client.connect()

         // Get all the guid of rss feed
        const newsGuid= structuredWorldNews.map((items)=>{
            return items.guid
        })
        

        // Creating input paramater for guid
        
        

        // Checking the db for any duplicate news guid
        const dupedGuid= await db.query(`select guid from clean_articles
                                          where guid =Any($1) `,[newsGuid])

            
        const dupedGuids= new Set(dupedGuid.rows.map(item=>item.guid))
       
            // First phase of deduplication
        let newStructuredWorldNews

        if(dupedGuid.rowCount===0){
            newStructuredWorldNews=structuredWorldNews

        }else {
           
            newStructuredWorldNews = structuredWorldNews.filter((item)=>!dupedGuids.has(item.guid))
        }

       


        console.log(`[RSS/DEDUPE] ${FLOW_BAR}`)
        console.log('[RSS/DEDUPE] Physical deduplication completed')
        console.log('[RSS/DEDUPE] Articles after dedupe:', newStructuredWorldNews.length, 'before dedupe:', structuredWorldNews.length)
        return newStructuredWorldNews;
    }catch(error){
        console.log('[RSS/DEDUPE][ERROR]', error)
        throw error
    }finally{
        db?.release()
    }
}


export async function createEmbedding(newStructuredWorldNews:Rss_Clean_Table[]){
    try{
         // String for generating embeddings

        const text= newStructuredWorldNews.map(item=>item.title.concat(".").concat(item.content?.slice(0,200)??""))
    const articleTitles = newStructuredWorldNews.map(item => item.title)

        // Generate Embedding
        
        console.log(`[RSS/QUEUE] ${FLOW_BAR}`)
        console.log('[RSS/QUEUE] Publishing embedding job with article count:', text.length)
    console.log('[RSS/QUEUE] Embedding job article titles:', articleTitles)
        EmbeddingQueue.add('createEmbedding',{text:text,newStructuredWorldNews:newStructuredWorldNews})

       
    }catch(error){
        console.log('[RSS/QUEUE][ERROR]', error)
        throw error
    }
}