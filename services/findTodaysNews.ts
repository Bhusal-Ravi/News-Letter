import dotenv from 'dotenv'
import { client as db_client } from '../connections/db_connection'
import { Rss_Clean_Table } from '../Types/Api_Types'

dotenv.config()

export async function findTodaysNewsPerTag() {
    const db = await db_client.connect()
    try {
        const tagsRes = await db.query('select tags, category, embedding, articles_per_tag from tags_embedding')
        const result: Record<string, Rss_Clean_Table[]> = {}

        for (const row of tagsRes.rows) {
            const articlesRes = await db.query(
                `select title, source, content, published_date, guid, category
         from clean_articles
         where category = $1
           and published_date >= now() - interval '24 hours'
         order by embedding <=> $2::vector
         limit $3`,
                [row.category, row.embedding, row.articles_per_tag ?? 3]
            )
            result[`${row.category}`] = articlesRes.rows as Rss_Clean_Table[]
        }

        return result
    } finally {
        db.release()
    }
}

export async function findTodaysNewsFlat(): Promise<Rss_Clean_Table[]> {
    return Object.values(await findTodaysNewsPerTag()).flat()
}