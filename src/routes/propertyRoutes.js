// src/routes/propertyRoutes.js
import express from 'express';

// Impor semua fungsi yang dibutuhkan dari controller
import { 
  createProperty, 
  getAllProperties, 
  getPropertyById 
} from '../controllers/propertyController.js';

const router = express.Router();

// Mendefinisikan semua rute untuk properti
router.get('/', getAllProperties);       // GET /api/properties -> dapatkan semua properti
router.get('/:id', getPropertyById);   // GET /api/properties/some-id -> dapatkan satu properti
router.post('/', createProperty);        // POST /api/properties -> buat properti baru

export default router;
