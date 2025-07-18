import express from 'express';
import dotenv from 'dotenv';
import cors, { CorsOptions } from 'cors'; // Impor tipe CorsOptions

// Impor router Anda
import aiRouter from './api/ai/ai.router.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

// --- KONFIGURASI CORS DENGAN TIPE DATA YANG BENAR ---
const allowedOrigins = ['https://sensible-way-658975.framer.app'];

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // PERBAIKAN: Tambahkan tipe data eksplisit untuk 'origin' dan 'callback'
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
// ----------------------------------------------------

app.use(express.json());

app.use('/api/v1/ai', aiRouter);

app.listen(port, () => {
    console.log(`AI Pricing Service Initialized (REAL AI MODE - Google Gemini)`);
    console.log(`Server is running on http://0.0.0.0:${port}`);
});
