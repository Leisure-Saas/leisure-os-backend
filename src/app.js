import express from 'express';
import dotenv from 'dotenv';

// Impor semua rute
import propertyRoutes from './routes/propertyRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js'; // <-- 1. TAMBAHKAN IMPOR INI

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ===================================
// DAFTARKAN SEMUA RUTE API DI SINI
// ===================================
// Rute untuk otentikasi (publik)
app.use('/api/auth', authRoutes);

// Rute untuk notifikasi dari layanan eksternal (publik)
app.use('/api/webhooks', webhookRoutes); // <-- 2. TAMBAHKAN RUTE INI

// Rute yang memerlukan otentikasi
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

// ===================================
// RUTE BAWAAN
// ===================================
app.get('/health', (_, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (_, res) => {
  res.send('Leisure OS backend running!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
