import { client } from "../connections/db_connection";
import { Rss_Clean_Table, Rss_Clean_Table_Embedding } from "../Types/Api_Types";

export async  function insertIntoCleanTable (data:Rss_Clean_Table_Embedding[]){
    let db
    if(!data || data.length===0){
        throw new Error(`No data available to insert into database`)
    }

    const validData = data.filter((item)=>Array.isArray(item.embedding) && item.embedding.length>0)
    if(validData.length===0){
        console.log('No rows with valid embeddings to insert into db')
        return
    }

    const values: Array<string> = []
    const rows = validData.map((item,index)=>{
        const base = index * 7
        values.push(
            item.title,
            item.source,
            item.content,
            item.published_date,
            item.guid,
            item.category,
            `[${item.embedding!.join(',')}]`
        )

        return `($${base+1}, $${base+2}, $${base+3}, $${base+4}, $${base+5}, $${base+6}, $${base+7}::vector)`
    })

    const query = `insert into clean_articles (title,source,content
                                    ,published_date,guid,category,embedding)
                                      values ${rows.join(',')}
                                      on conflict (guid) do nothing`
    
    
    try{
        db= await client.connect()
        await db.query('BEGIN')

                const insert= await db.query(query, values) 
         
        if(insert.rowCount===0){
            console.log('Nothing to insert into db')
        }else{
            console.log(`Inserted ${insert.rowCount} new News into clean_articles table`)
        }
        const deletion= await db.query(`delete from clean_articles a
                                        using clean_articles b
                                        where a.id>b.id
                                        AND a.created_at >= now() - interval '12 hours'
                                        AND b.created_at >= now() - interval '12 hours'
                                        AND 1-(a.embedding <=> b.embedding) >= 0.92 
                                        returning a.title as deleted, b.title as defendent`)
        
        if(deletion.rowCount===0){
            console.log('No articles were found to have cosine similarity >= 0.92')
        }else{
            console.log(deletion.rows)
            console.log(`Deleted ${deletion.rowCount} items from clean_articles that may be similar`)
        }
        
        await db.query('COMMIT')
    }catch(error){
        if(db){
            await db.query('ROLLBACK')
        }
        console.log(error)
    }finally{
        db?.release()
    }
}