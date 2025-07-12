import express from 'express';
import dotenv from 'dotenv';

// Load environment variables from .env file if present
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk parsing JSON
app.use(express.json());

// Health check route
app.get('/', (_, res) => {
  res.send('✅ Leisure OS backend running!');
});

// Tambahkan rute fallback untuk undefined endpoints
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Jalankan server dan bind ke 0.0.0.0 (wajib di Railway)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server listening on port ${PORT}`);
});

