// import { client } from "../connections/db_connection";
import dotenv from 'dotenv';
import { NEWSLETTER_TAGS } from "../config/newsletter_tags";
import { client } from "../connections/vogaye_connection";
import { client as db_client } from '../connections/db_connection';
import { insertIntoTags } from '../sql/insert_into_tag';
import { Tags } from '../Types/Api_Types';


dotenv.config();

async function createTags() {
    let db
    try {
        
         db=await db_client.connect()
        const text= NEWSLETTER_TAGS.map((item)=>{
             return item.tags
        })

        const embeddings= await client.embed({
             input:text,
             model:'voyage-4-lite',
        })

        const tagsWithEmbeddings: Tags[] = NEWSLETTER_TAGS.map((item,index)=>({
            ...item,
            embedding:embeddings?.data?.[index].embedding

        }))



       await  insertIntoTags(tagsWithEmbeddings)

    } catch (error) {
        console.log(error)
    }
}


createTags()