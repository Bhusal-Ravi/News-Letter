import dotenv from 'dotenv'
import { client } from '../connections/db_connection'
import { findTodaysNewsPerTag, findTodaysNewsFlat } from '../services/findTodaysNews'
import { Rss_Clean_Table } from '../Types/Api_Types'
import { webSearch } from '../services/webSearch'

dotenv.config()

export async function startNewsFinding() {
  const perTag = await findTodaysNewsPerTag()
  const data: Rss_Clean_Table[] = []

  for (const [key, value] of Object.entries(perTag)) {
    console.log(key.toUpperCase(), " For Today: \n", value)
    for (let item of value) {
      data.push(item)
    }
  }
  console.log('data', data)
  const flat = await findTodaysNewsFlat()
  console.log('\nFlat result total:', flat.length)
  let db = await client.connect()

  try {
    await client.query(`BEGIN`)
    const PreparedStatement = []
    const values = []
    for (let i = 0; i < data.length; i++) {
      let base = i * 6

      PreparedStatement.push(`($${base + 1},$${base + 2},$${base + 3},$${base + 4}::timestamptz,$${base + 5},$${base + 6})`)
      values.push(data[i].title, data[i].source, data[i].content, data[i].published_date, data[i].guid, data[i].category)
    }

    const query = `insert into temp_rank_table (title,source,content,published_date,guid,category)
                  values ${`${PreparedStatement.join(',')}`}     `


    const truncate = await db.query(`truncate table temp_rank_table`)
    console.log(`Truncated Previous Data Rows`)
    const insert = await db.query(query, values)

    if (insert.rowCount === 0) {
      await db.query('ROLLBACK')
      console.log('Failed to insert into temp_rank_table')
    }

    console.log(`Sucessfully Inserted Todays ranked articles in database: ${insert.rowCount} Rows`)
    await db.query('COMMIT')

    // Starting The WebSearch Pipeline

    await webSearch()

  } catch (error) {
    await db.query('ROLLBACK')
    console.log(error)
  } finally {
    db.release()
  }


}

