import Parser from 'rss-parser'
import { Rss_Clean_Table, Rss_Clean_Table_Embedding, Rss_Feed_Type } from '../Types/Api_Types'
import { client } from '../connections/vogaye_connection'
import { client  as db_client } from '../connections/db_connection'
import { insertIntoCleanTable } from '../sql/insert_into_clean_table'

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


const worldNewsUrl=['https://www.aljazeera.com/xml/rss/all.xml',
                    'http://feeds.bbci.co.uk/news/world/rss.xml'
                  ]


export async function handleRssFeed(){
    let db
    try{
        db=await db_client.connect()
        const worldNewsArray= await Promise.all(
            worldNewsUrl.map((url)=>parser.parseURL(url)) 
        )
       
        const worldNews:Rss_Feed_Type[]= worldNewsArray.flatMap((news)=>news.items) as Rss_Feed_Type[]
        const structuredWorldNews:Rss_Clean_Table[]= worldNews.map((news)=>(
            {
                title:news.title,
                source:news.link,
                content:news.content,
                published_date:news.isoDate,
                guid:news.guid,
                category:"worldnews"
            }

        ))

        // Get all the guid of rss feed
        const newsGuid= structuredWorldNews.map((items)=>{
            return items.guid
        })

        // Creating input paramater for guid
        const sqlQuery= newsGuid.join(',')

        // Checking the db for any duplicate news guid
        const dupedGuid= await db.query(`select guid from clean_articles
                                          where guid in  (
                                            $1
                                          )      `,[sqlQuery])

            
        
        
            // First phase of deduplication
        let newStructuredWorldNews

        if(dupedGuid.rowCount===0){
            newStructuredWorldNews=structuredWorldNews

        }else {
            newStructuredWorldNews = structuredWorldNews.filter((item)=>!dupedGuid.rows.includes(item.guid))
        }

       


        console.log(newStructuredWorldNews.length,structuredWorldNews.length)

        


        // String for generating embeddings

        const text= newStructuredWorldNews.map(item=>item.title.concat(".").concat(item.content))

        // Generate Embedding
        const result= await client.embed({
                            input:text,
                            model:'voyage-4-lite',
                            
                        })

        
        const newsWithEmbeddings:Rss_Clean_Table_Embedding[]= newStructuredWorldNews.map((item,index)=>({
            ...item,
            embedding: result?.data?.[index].embedding
        }))

         // Insert into Db
          await  insertIntoCleanTable(newsWithEmbeddings)
        

        
        

    }catch(error){
        console.log(error)
        throw new Error
    }
}

  handleRssFeed()