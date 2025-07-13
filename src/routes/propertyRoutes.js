import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authorizationMiddleware.js'; // <-- Impor authorize
import { createProperty, getAllProperties, getPropertyById } from '../controllers/propertyController.js';

const router = express.Router();

// Rute yang bisa diakses publik
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);

// Rute yang dilindungi:
// Harus login DAN harus memiliki peran 'OWNER'
router.post('/', authenticateToken, authorize(['OWNER']), createProperty);

export default router;
