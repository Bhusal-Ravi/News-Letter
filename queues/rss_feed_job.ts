import { Queue, Worker } from 'bullmq'
import { connection } from '../connections/reddis_connection'
import { createEmbedding, handleRssFeed, physicalDedupe } from '../services/rssFeed'

const FLOW_BAR = '----------------------------------------'

const RssQueue = new Queue('news', { connection })
const RssWorker = new Worker ('news',async job=>{
    console.log(`[RSS/WORKER] ${FLOW_BAR}`)
    console.log(`[RSS/WORKER] Started job: ${job.name} (id: ${job.id})`)
    const sources:string[]= job.data.sources
    const category= job.name
    console.log(`[RSS/WORKER] Category: ${category}, sources: ${sources.length}`)
    console.log('[RSS/WORKER] Source list:', sources)
   const structuredWorldNews= await handleRssFeed(sources,category);
   const newStructuredWorldNews= await physicalDedupe(structuredWorldNews)
   console.log(newStructuredWorldNews)
    await createEmbedding(newStructuredWorldNews)

    console.log(`[RSS/WORKER] Completed job: ${job.name} (id: ${job.id}) with ${newStructuredWorldNews.length} deduped articles`)

},{connection})

export async function closeRssFeedResources() {
    await Promise.all([
        RssWorker.close(),
        RssQueue.close(),
    ])
}



export async function pullRssFeed(){
    try{
        console.log(`[RSS/PUBLISHER] ${FLOW_BAR}`)
        console.log('[RSS/PUBLISHER] Queueing worldnews and technews pull jobs')
        RssQueue.add('worldnews',{sources:['https://www.aljazeera.com/xml/rss/all.xml',
                    'http://feeds.bbci.co.uk/news/world/rss.xml',
                    'https://www.ft.com/world?format=rss',
                    'https://rss.nytimes.com/services/xml/rss/nyt/World.xml']})

        RssQueue.add('technews', { sources: [
                           
                        'https://feeds.arstechnica.com/arstechnica/index'               
                                     
                                       
                        
                        ]})
    }catch(error){
        console.log('[RSS/PUBLISHER][ERROR]', error)
    }
}

