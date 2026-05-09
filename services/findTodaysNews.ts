import dotenv from 'dotenv'
import { client as db_client } from '../connections/db_connection'
import { Rss_Clean_Table } from '../Types/Api_Types'

dotenv.config()

const FLOW_BAR = '----------------------------------------'

export async function findTodaysNewsPerTag(verbose = false) {
  let db
  try {
    db = await db_client.connect()

    // Load tags embeddings and desired articles_per_tag from DB
    const tagsRes = await db.query('select tags, category, embedding, articles_per_tag from tags_embedding')

    const result: Record<string, Rss_Clean_Table[]> = {}

    for (const row of tagsRes.rows) {
      const tagText: string = row.tags
      const category: string = row.category
      const embedding = row.embedding // expected to be stored as '[x,y,...]'
      const limit = row.articles_per_tag ?? 3

      if (verbose) {
        console.log(`[FIND/TAG] ${FLOW_BAR}`)
        console.log('[FIND/TAG] Finding top articles for tag:', tagText, 'category:', category)
      }

      // Find today's articles in the same category ordered by vector distance to tag embedding
      const query = `select title, source, content, published_date, guid, category
                     from clean_articles
                     where category = $1
                       and published_date >= now() - interval '24 hours'
                     order by embedding <=> $2::vector
                     limit $3`

      const articlesRes = await db.query(query, [category, embedding, limit])

      result[`${category}:${tagText}`] = articlesRes.rows as Rss_Clean_Table[]
    }

    return result
  } catch (error) {
    if (verbose) console.log('[FIND/TODAY][ERROR]', error)
    throw error
  } finally {
    db?.release()
  }
}

export async function findTodaysNewsFlat() {
  const perTag = await findTodaysNewsPerTag()
  const flat: Rss_Clean_Table[] = Object.values(perTag).flat()
  return flat
}
