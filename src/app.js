import express from 'express';
import dotenv from 'dotenv';

// Impor semua rute
import propertyRoutes from './routes/propertyRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js'; // <-- BARIS INI DITAMBAHKAN

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ===================================
// DAFTARKAN SEMUA RUTE API DI SINI
// ===================================
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes); // <-- BARIS INI DITAMBAHKAN

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
