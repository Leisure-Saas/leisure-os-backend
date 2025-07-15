import express from 'express';
import dotenv from 'dotenv';

// Impor utilitas dan pengendali error
import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';

// Impor semua rute
import propertyRoutes from './routes/propertyRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ===================================
// RUTE API
// ===================================
app.use('/api/auth', authRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);


// ===================================
// PENANGANAN ERROR
// ===================================

// PENANGKAP RUTE YANG TIDAK DITEMUKAN (404)
// Ini akan berjalan jika request tidak cocok dengan rute mana pun di atas
app.all('*', (req, res, next) => {
  next(new AppError(`Tidak bisa menemukan ${req.originalUrl} di server ini!`, 404));
});

// GLOBAL ERROR HANDLING MIDDLEWARE
// Middleware dengan 4 argumen (err, req, res, next) dianggap sebagai error handler
app.use(globalErrorHandler);


// ===================================
// START SERVER
// ===================================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
