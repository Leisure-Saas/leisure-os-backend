// src/app.js
import express from 'express';
import dotenv from 'dotenv';
import propertyRoutes from './routes/propertyRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// =======================================================
// ▼▼▼ RUTE TES DIAGNOSTIK ▼▼▼
// =======================================================
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: "Test route is working!" });
});
// =======================================================

// DAFTARKAN RUTE API DI SINI
app.use('/api/properties', propertyRoutes);

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
