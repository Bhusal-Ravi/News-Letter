import dotenv from 'dotenv'
import { findTodaysNewsPerTag, findTodaysNewsFlat } from '../services/findTodaysNews'

dotenv.config()

async function run() {
  const perTag = await findTodaysNewsPerTag()


  for (const [key, value] of Object.entries(perTag)) {
    console.log(key.toUpperCase(), " For Today: \n", value)
  }

  const flat = await findTodaysNewsFlat()
  console.log('\nFlat result total:', flat.length)
}

run()