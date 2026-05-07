import { client } from "../connections/db_connection";
import dotenv from 'dotenv';
import { NEWSLETTER_TAGS } from "../config/newsletter_tags";


dotenv.config();

async function createTags() {
    let db
    try {
        db = await client.connect();

        NEWSLETTER_TAGS.forEach((tag) => {

        })

    } catch (error) {
        console.log(error)
    }
}