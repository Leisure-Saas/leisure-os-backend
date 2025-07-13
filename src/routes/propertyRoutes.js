// src/routes/propertyRoutes.js
import express from 'express';
import { createProperty } from '../controllers/propertyController.js';

const router = express.Router();

// Saat ada request POST ke alamat '/', jalankan fungsi createProperty
router.post('/', createProperty);

export default router;
