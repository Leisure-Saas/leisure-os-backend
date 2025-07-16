import express from 'express';
import dotenv from 'dotenv';
import rulesRouter from './api/rules/rules.routes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use('/api/v1/host/properties/:propertyId/rules', rulesRouter);
app.get('/', (req, res) => { res.send('Leisure OS Backend is running!'); });
app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`);
