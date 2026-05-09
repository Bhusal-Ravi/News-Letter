import dotenv from 'dotenv'
import { findTodaysNewsPerTag, findTodaysNewsFlat } from '../services/findTodaysNews'

dotenv.config()

async function run(){
  try{
    // call with verbose=false to reduce console output
    const perTag = await findTodaysNewsPerTag(false)
    console.log('Found articles per tag (summary):')
    for(const key of Object.keys(perTag)){
      const items = perTag[key]
      const first = items[0]
      const title = first ? first.title : 'no articles'
      console.log(`${key} — ${items.length} articles — top: ${title}`)
    }

    // flat list count
    const flat = await findTodaysNewsFlat()
    console.log('\nFlat result total:', flat.length)

  }catch(error){
    console.log('[SCRIPT/ERROR]', error)
  }
}

run()
