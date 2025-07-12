import express from 'express';
import {
  createInquiry,
  getInquiriesByProperty,
} from '../controllers/inquiry.controller.js';

const router = express.Router();

// Define the routes
router.post('/', createInquiry);
router.get('/property/:propertyId', getInquiriesByProperty);

export default router;
