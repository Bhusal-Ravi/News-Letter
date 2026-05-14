import {tavily} from '@tavily/core'
import dotenv from 'dotenv'
dotenv.config()


export const tvly = tavily({ apiKey: process.env.TAVILY_KEY });


if(tvly) console.log("Tavily Connected Successfully")