import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
dotenv.config();
import authRoutes from './routes/auth.routes.js';
import dataRoutes from './routes/data.routes.js';
import { notFound, errorHandler } from './middleware/error.js';



console.log("ENV:", process.env.PANIC_CRYPTO_TOKEN);
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


app.get('/', (_, res) => res.json({ ok: true, service: 'crypto-dashboard-backend' }));

app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
