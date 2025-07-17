import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // <-- 1. IMPOR CORS
import rulesRouter from './api/rules/rules.routes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';

// --- Middleware ---
app.use(cors()); // <-- 2. GUNAKAN CORS DI SINI
app.use(express.json());


// --- Routes ---
app.use('/api/v1/host/properties/:propertyId/rules', rulesRouter);

app.get('/', (req, res) => {
  res.send('Leisure OS Backend is running!');
});


// --- Server Listener ---
app.listen(Number(PORT), HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
