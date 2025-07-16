// file: src/server.ts
import express from 'express';
import dotenv from 'dotenv';
import rulesRouter from './api/rules/rules.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware untuk membaca JSON body
app.use(express.json());

// Gunakan router untuk aturan harga
app.use('/api/v1/host/properties/:propertyId/rules', rulesRouter);

// Endpoint dasar untuk cek status
app.get('/', (req, res) => {
    res.send('Leisure OS Backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
