import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import propertyRoutes from './routes/property.routes.js';
import inquiryRoutes from './routes/inquiry.routes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/properties', propertyRoutes);
app.use('/inquiries', inquiryRoutes);

// Root URL handler
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Leisure OS Backend API. The server is healthy.' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running and listening on port ${PORT}`);
});
