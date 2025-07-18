import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // 1. Impor paketnya

// Impor router Anda
import aiRouter from './api/ai/ai.router.js';
// ...impor router lainnya di sini...

// Inisialisasi dotenv untuk memuat environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

// --- KONFIGURASI CORS (BAGIAN PENTING) ---
// Mendefinisikan alamat frontend mana yang diizinkan untuk mengakses backend ini
const allowedOrigins = ['https://sensible-way-658975.framer.app'];

const corsOptions = {
  origin: (origin, callback) => {
    // Izinkan jika origin ada di dalam daftar, atau jika tidak ada origin (misalnya, saat tes via Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions)); // 2. Terapkan sebagai middleware
// ---------------------------------------------

// Middleware untuk mem-parsing body JSON dari request
app.use(express.json());

// Gunakan router-router Anda
app.use('/api/v1/ai', aiRouter);
// ...gunakan router lainnya di sini...


// Jalankan server
app.listen(port, () => {
    console.log(`AI Pricing Service Initialized (REAL AI MODE - Google Gemini)`);
    console.log(`Server is running on http://0.0.0.0:${port}`);
});
