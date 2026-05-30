import dotenv from 'dotenv'
dotenv.config()

import {VoyageAIClient} from 'voyageai'
import { logger } from '../utils/logger'
export const client= new VoyageAIClient({apiKey:process.env.VOYAGE_API_KEY})

 if(client) logger.info('Voyage Connected Successfully')