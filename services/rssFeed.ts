import Parser from 'rss-parser'
import { Rss_Feed_Type } from '../Types/Api_Types'
import { client } from '../connections/vogaye_connection'

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
    try{
        const worldNewsArray= await Promise.all(
            worldNewsUrl.map((url)=>parser.parseURL(url)) 
        )
       
        const worldNews:Rss_Feed_Type[]= worldNewsArray.flatMap((news)=>news.items) as Rss_Feed_Type[]
        const structuredWorldNews= worldNews.map((news)=>(
            {
                title:news.title,
                link:news.link,
                content:news.content,
                isoDate:news.isoDate,
                guid:news.guid,
                type:"worldnews"
            }

        ))

        const text= structuredWorldNews.map(item=>item.title.concat(".").concat(item.content))

        const result= await client.embed({
                            input:text,
                            model:'voyage-4-lite'
                        })

        const newsWithEmbeddings= structuredWorldNews.map((item,index)=>({
            ...item,
            embedding: result?.data?.[index].embedding
        }))


        

        console.log(newsWithEmbeddings)
        

    }catch(error){
        console.log(error)
        throw new Error
    }
}

// handleRssFeed()