import dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import cors from 'cors';
import './connections/db_connection'
import './connections/vogaye_connection'
import './connections/reddis_connection'
import { Queue, Worker } from 'bullmq'
import { connection } from './connections/reddis_connection'; 
import { handleRssFeed } from './services/rssFeed';
import { pullRssFeed } from './queues/rss_feed_job';

const FLOW_BAR = '----------------------------------------'

const app = express();

const corsOptions = {
	origin: true,
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', async (req, res) => {
	res.json('Server Healthy');
});

const JobRepeatQueue= new Queue('repeat',{connection})
const JobRepeatWorker= new Worker('repeat', async job=>{
	console.log(`[SCHEDULER] ${FLOW_BAR}`)
	console.log('[SCHEDULER] Initiated next pull phase of news')
	pullRssFeed()
}, {connection})

async function scheduleOperation(){

const start= await JobRepeatQueue.upsertJobScheduler(
  'my-scheduler-id',
  { pattern: '*/30 * * * *' },
  {
    opts: {
      backoff: 3,
      attempts: 5,
      removeOnFail: 1000,
    },
  },
);
}

scheduleOperation()


app.listen(3000, () => {
	console.log('[SERVER] Server started on port 3000');
});
