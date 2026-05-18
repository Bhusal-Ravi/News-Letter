import { Queue, Worker } from 'bullmq'
import { connection } from '../connections/reddis_connection'
import { client } from '../connections/db_connection'
import { Rss_Clean_Table, Temp_Rank_Table } from '../Types/Api_Types'
import { AIMessage, createAgent, tool } from "langchain";




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
const LlmWorker = new Worker('Llm', async job => {
    let db = await client.connect()
    try {
        const data: Temp_Rank_Table = job.data
        const response = await agent.invoke({
            messages: [

                {
                    role: 'human', content: `
                                                ${data.content.concat(data.raw_content)}
                                                `
                }
            ]
        })

        const summary = String(response.messages[response.messages.length - 1].text ?? '').trim()

        console.log(summary, '\n')

        const query = `insert into final_rank_table
                        (guid, title, content, source, category, published_date,image_url)
                        values ($1, $2, $3, $4, $5, $6,$7)
                        on conflict (guid)
                        do update set
                          title = excluded.title,
                          content = excluded.content,
                          source = excluded.source,
                          category = excluded.category,
                          published_date = excluded.published_date,
                          image_url = excluded.image_url`

        const insert = await db.query(query, [
            data.guid,
            data.title,
            summary,
            data.source,
            data.category,
            data.published_date,
            data.image_url
        ])


        if (insert.rowCount !== 0) {
            console.log(`Inserted News Article [${data.title.toUpperCase()}]into db \n`)
        }

        return {
            rowCount: insert.rowCount,
            guid: data.guid
        }



    } catch (error) {
        console.error('[LLM/WORKER][ERROR]', error)
        throw error
    } finally {
        db.release()
    }


}, {
    connection,
    concurrency: 5,
    limiter: {
        max: 10,
        duration: 60 * 1000,
    },

})

LlmWorker.on('failed', (job, error) => {
    console.error('[LLM/WORKER][FAILED]', job?.id, job?.name, error)
})

LlmWorker.on('error', (error) => {
    console.error('[LLM/WORKER][ERROR EVENT]', error)
})

export async function closeLlmResources() {
    await Promise.all([
        LlmWorker.close(),
        LlmQueue.close(),
    ])
}


export async function startLlmSummarization(data: Temp_Rank_Table[]) {

    if (!data) {
        console.log("No data to start webSearch")
        return
    }

    for (let item of data) {
        await LlmQueue.add('llm_content', item)
    }

}