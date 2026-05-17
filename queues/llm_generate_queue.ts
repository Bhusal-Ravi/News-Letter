import { Queue, Worker } from 'bullmq'
import { connection } from '../connections/reddis_connection'
import { client } from '../connections/db_connection'
import { Rss_Clean_Table } from '../Types/Api_Types'
import { AIMessage, createAgent, tool } from "langchain";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";



export const agent = createAgent({
  model: "google-genai:gemma-4-31b-it",
  systemPrompt: `You are a professional newsletter content summarizer.
                                    Your job is to convert raw news article content into concise, accurate summaries for email newsletters. The input may contain noisy scraped text, repeated paragraphs, ads, navigation text, irrelevant links, or formatting issues. Identify the core news event and summarize only the important information for readers.

                                    Rules:
                                    - Write exactly 80-100 words
                                    - Use simple, professional, and easy-to-read language
                                    - Focus on what happened and why it matters
                                    - Remove repeated information, filler text, and irrelevant background details
                                    - Ignore advertisements, website navigation text, and unrelated content
                                    - Do not create sections, bullet points, or headings
                                    - Do not add opinions, speculation, or facts not present in the source
                                    - Do not exaggerate the story
                                    - Keep formatting consistent across all articles
                                    - Output only the final summary
                                    - Do not include reasoning, analysis, chain-of-thought, or hidden thinking `
  
});
const LlmQueue = new Queue('Llm', { connection })
const LlmWorker = new Worker ('Llm',async job=>{
    let db= await client.connect()
        try{
            const data:Rss_Clean_Table= job.data
            const response= await agent.invoke({
                messages:[
                    
                    {
                        role:'human', content:`
                                                ${data.content}
                                                `
                    }
                ]
            })

           const summary = String(response.messages[response.messages.length - 1].text ?? '').trim()

            console.log(summary,'\n')

           const query=`insert into final_rank_table
                        (guid, title, content, source, category, published_date)
                        values ($1, $2, $3, $4, $5, $6)
                        on conflict (guid)
                        do update set
                          title = excluded.title,
                          content = excluded.content,
                          source = excluded.source,
                          category = excluded.category,
                          published_date = excluded.published_date`

           const insert = await db.query(query,[
            data.guid,
            data.title,
            summary,
            data.source,
            data.category,
            data.published_date
           ])


           if(insert.rowCount!==0){
            console.log(`Inserted \n
                ${data.title}
                into db`)
        }

           return {
            rowCount: insert.rowCount,
            guid: data.guid
           }

        
    
        }catch(error){
            console.log(error)
        }finally{
            db.release()
        }
    

},{ connection,
    concurrency: 5,
    limiter:{
        max: 10,
        duration: 60 * 1000 ,
    },
    
})


export async function startLlmSummarization(data:Rss_Clean_Table[]){

    if(!data) {
        console.log("No data to start webSearch")
        return
    }

      for(let item of data){
        LlmQueue.add('llm_content',item)
    }

}