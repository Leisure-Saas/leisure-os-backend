import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (_, res) => {
  res.send('✅ Leisure OS backend running!');
});

// Wajib untuk Railway health check
app.get('/health', (_, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
