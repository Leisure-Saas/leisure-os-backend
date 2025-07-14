import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authorizationMiddleware.js';

// Impor semua fungsi yang dibutuhkan dari controller, termasuk yang baru
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from '../controllers/propertyController.js';

const router = express.Router();

// =======================================================
// RUTE PUBLIK - Siapa saja bisa melihat data properti
// =======================================================
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);

// =======================================================
// RUTE TERPROTEKSI - Hanya untuk pengguna dengan peran 'OWNER'
// =======================================================

// Membuat properti baru
router.post('/', authenticateToken, authorize(['OWNER']), createProperty);

// Memperbarui properti berdasarkan ID
router.patch('/:id', authenticateToken, authorize(['OWNER']), updateProperty);

// Menghapus properti berdasarkan ID
router.delete('/:id', authenticateToken, authorize(['OWNER']), deleteProperty);

export default router;
