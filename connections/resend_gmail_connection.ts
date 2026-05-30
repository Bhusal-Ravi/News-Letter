import { Resend } from 'resend';
import dotenv from 'dotenv'
import { logger } from '../utils/logger'
dotenv.config()



export const resend = new Resend(process.env.RESEND_KEYS);

if(resend) logger.info('resend Connected Successfully')

