import express from 'express';
import dotenv from 'dotenv';
import cors, { CorsOptions } from 'cors';

// Impor router Anda
import aiRouter from './api/ai/ai.router.js';
import orchestratorRouter from './api/orchestrator/orchestrator.router.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

// --- KONFIGURASI CORS YANG DIPERBARUI DAN LEBIH ANDAL ---
const allowedOrigins = ['https://sensible-way-658975.framer.app'];

// PERBAIKAN: Kita sederhanakan agar library cors menangani semua kasus secara otomatis
const corsOptions: CorsOptions = {
  origin: allowedOrigins
};

app.use(cors(corsOptions));
// ----------------------------------------------------

app.use(express.json());

// Gunakan router-router Anda
app.use('/api/v1/ai', aiRouter);
app.use('/api/v1/orchestrator', orchestratorRouter);

app.listen(port, () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
});
