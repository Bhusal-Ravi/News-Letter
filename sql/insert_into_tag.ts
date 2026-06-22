import { client } from "../connections/db_connection";
import { Tags } from "../Types/Api_Types";
import { logger } from "../utils/logger";



export async function insertIntoTags(data: Tags[]) {
    let db
    try {
        db = await client.connect()

        const values = []
        const actualData = []
        for (let i = 0; i < data.length; i++) {
            const base = i * 4
            actualData.push(data[i].tags, data[i].category, `[${data[i].embedding!.join(',')}]`, data[i].articles_per_tag)
            values.push(`($${base + 1},$${base + 2},$${base + 3}::vector,$${base + 4})`)
        }
        await db.query('BEGIN')

        const truncate= await db.query(`truncate table tags_embedding `)

        const query = `insert into tags_embedding (tags,category,embedding,articles_per_tag)
                 values
                 ${values.join(',')}`

        const insert = await db.query(query, actualData)
         await db.query('COMMIT')

        logger.info({ rowCount: insert.rowCount }, 'Inserted rows')


    } catch (error) {
         if (db) {
        await db.query('ROLLBACK')
         }
        logger.error({ error })
    } finally {
        if (db) {
            db.release()
        }
    }

}