import express from 'express';
import {
  getAllProperties,
  createProperty,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from '../controllers/property.controller.js';

const router = express.Router();

// Mendefinisikan semua rute untuk properti
router.get('/', getAllProperties);
router.post('/', createProperty);
router.get('/:id', getPropertyById);
router.put('/:id', updateProperty);
router.delete('/:id', deleteProperty);

export default router;
