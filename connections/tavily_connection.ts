import {tavily} from '@tavily/core'
import dotenv from 'dotenv'
import { logger } from '../utils/logger'
dotenv.config()


export const tvly = tavily({ apiKey: process.env.TAVILY_KEY });


if(tvly) logger.info('Tavily Connected Successfully')