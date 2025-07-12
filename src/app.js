import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get('/', (_, res) => {
  res.send('✅ Leisure OS backend running!');
});

// 🩺 Endpoint untuk health check Railway
app.get('/health', (_, res) => {
  res.status(200).send('OK');
});

// Bind ke 0.0.0.0 agar bisa diakses Railway container
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
