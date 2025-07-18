import express from 'express';
import dotenv from 'dotenv';
import cors, { CorsOptions } from 'cors';

// Impor router Anda
import aiRouter from './api/ai/ai.router.js';
import orchestratorRouter from './api/orchestrator/orchestrator.router.js'; // <-- 1. Impor router baru

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

const allowedOrigins = ['https://sensible-way-658975.framer.app'];
const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
app.use(cors(corsOptions));

app.use(express.json());

// Gunakan router-router Anda
app.use('/api/v1/ai', aiRouter);
app.use('/api/v1/orchestrator', orchestratorRouter); // <-- 2. Daftarkan router baru

app.listen(port, () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
});
