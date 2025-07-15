// src/routes/propertyRoutes.js
import express from 'express';
import {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty
} from '../controllers/propertyController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authorizationMiddleware.js';
import { propertyValidationRules, validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/', getAllProperties);
router.get('/:id', getPropertyById);

// ▼▼▼ PERBAIKAN URUTAN ADA DI SINI ▼▼▼
router.post('/',
  authenticateToken,
  authorize(['OWNER']),
  propertyValidationRules(), // 1. Terapkan aturan
  validate,                // 2. Periksa hasil validasi
  createProperty             // 3. Controller HANYA akan dijalankan jika validasi lolos
);

router.patch('/:id',
  authenticateToken,
  authorize(['OWNER']),
  propertyValidationRules(), // Terapkan juga di rute update
  validate,
  updateProperty
);

router.delete('/:id', authenticateToken, authorize(['OWNER']), deleteProperty);

export default router;
