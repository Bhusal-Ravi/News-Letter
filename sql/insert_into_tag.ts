import { client } from "../connections/db_connection";
import { Tags } from "../Types/Api_Types";



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
        const query = `insert into tags_embedding (tags,category,embedding,articles_per_tag)
                 values
                 ${values.join(',')}`

        const insert = await db.query(query, actualData)

        console.log("Inserted rows", insert.rowCount)


    } catch (error) {
        console.log(error)
    } finally {
        if (db) {
            db.release()
        }
    }

}