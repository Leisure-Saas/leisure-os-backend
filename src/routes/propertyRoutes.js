import express from 'express';
import {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty
} from '../controllers/propertyController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
// ▼▼▼ UBAH DI SINI: Impor 'authorize', bukan 'authorizeOwner' ▼▼▼
import { authorize } from '../middleware/authorizationMiddleware.js';

const router = express.Router();

// Rute yang bisa diakses publik
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);

// ▼▼▼ UBAH DI SINI: Gunakan authorize(['OWNER']) untuk melindungi rute ▼▼▼
// Rute yang hanya bisa diakses oleh user yang login & memiliki peran OWNER
router.post('/', authenticateToken, authorize(['OWNER']), createProperty);
router.patch('/:id', authenticateToken, authorize(['OWNER']), updateProperty);
router.delete('/:id', authenticateToken, authorize(['OWNER']), deleteProperty);

export default router;
