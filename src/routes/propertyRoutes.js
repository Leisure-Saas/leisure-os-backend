import express from 'express';
import {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty
} from '../controllers/propertyController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authorizeOwner } from '../middleware/authorizationMiddleware.js';

const router = express.Router();

// Rute yang bisa diakses publik
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);

// Rute yang hanya bisa diakses oleh user yang login & memiliki peran OWNER
router.post('/', authenticateToken, authorizeOwner, createProperty);
router.patch('/:id', authenticateToken, authorizeOwner, updateProperty);
router.delete('/:id', authenticateToken, authorizeOwner, deleteProperty);

export default router;
