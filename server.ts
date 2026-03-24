import dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import cors from 'cors';
import './connections/db_connection'
import './connections/vogaye_connection'


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

app.listen(3000, () => {
	console.log('Server started on port 3000');
});
