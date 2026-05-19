import dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import cors from 'cors';
import './connections/db_connection'
import './connections/vogaye_connection'
import './connections/reddis_connection'
import './connections/tavily_connection'
import { Queue, Worker } from 'bullmq'
import { connection } from './connections/reddis_connection';
import { pullRssFeed } from './queues/rss_feed_job';
import { closeRssFeedResources } from './queues/rss_feed_job';
import { closeWebSearchResources } from './queues/web_search_queue';
import { closeLlmResources } from './queues/llm_generate_queue';
import { closeEmbeddingResources } from './queues/embedding_queue';
import { startNewsFinding } from './scripts/findTodaysNews';
import { sendEmail } from './services/sendEmail';

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

const JobRepeatQueue = new Queue('repeat', { connection })
const JobRepeatWorker = new Worker('repeat', async job => {

	const jobId = job.name

	if (jobId === 'start') {
		console.log(`[SCHEDULER] ${FLOW_BAR}`)
		console.log('[SCHEDULER] Initiated next pull phase of news')
		await pullRssFeed()
	}

	if (jobId === 'startnewsgeneration') {
		console.log("[SCHEDULER] Starting the finding todays news job")
		await startNewsFinding()
	}

	if (jobId === 'startemailqueue') {
		await sendEmail()
	}



}, { connection })

let isShuttingDown = false

async function closeRepeatResources() {
	await Promise.all([
		JobRepeatWorker.close(),
		JobRepeatQueue.close(),
	])
}

async function shutdown(signal: string) {
	if (isShuttingDown) {
		return
	}
	isShuttingDown = true

	console.log(`[SERVER] Received ${signal}, closing Redis resources...`)

	try {
		await Promise.all([
			closeRepeatResources(),
			closeRssFeedResources(),
			closeWebSearchResources(),
			closeLlmResources(),
			closeEmbeddingResources(),
		])
		console.log('[SERVER] Redis resources closed')
	} catch (error) {
		console.error('[SERVER] Error while closing Redis resources', error)
	} finally {
		process.exit(0)
	}
}

process.once('SIGINT', () => {
	void shutdown('SIGINT')
})

process.once('SIGTERM', () => {
	void shutdown('SIGTERM')
})

async function scheduleOperation() {

	const start = await JobRepeatQueue.upsertJobScheduler(
		'start',
		{ pattern: '*/30 * * * *' },
		{
			opts: {
				backoff: 3,
				attempts: 5,
				removeOnFail: 200,
			},
		},
	);

	const startNewsGeneration = await JobRepeatQueue.upsertJobScheduler(
		'startnewsgeneration',
		{
			pattern: '0 52 14 * * *',
			tz: 'Asia/Kathmandu'
		},
		{
			opts: {
				backoff: 3,
				attempts: 5,
				removeOnFail: 200,
			},
		},
	);

	const startEmailQueue = await JobRepeatQueue.upsertJobScheduler(
		'startemailqueue',
		{
			pattern: '0 41 21 * * *',
			tz: 'Asia/Kathmandu'
		},
		{
			opts: {
				backoff: 3,
				attempts: 5,
				removeOnFail: 200,
			},
		},
	);

}

scheduleOperation()


app.listen(3000, () => {
	console.log('[SERVER] Server started on port 3000');
});
