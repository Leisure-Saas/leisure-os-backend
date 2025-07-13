// src/routes/bookingRoutes.js
import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';

// Impor semua fungsi yang dibutuhkan dari controller
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
} from '../controllers/bookingController.js';

const router = express.Router();

// Rute Publik (siapa saja bisa melihat)
router.get('/', getAllBookings);
router.get('/:id', getBookingById);

// Rute Terproteksi (hanya user yang sudah login yang bisa mengakses)
router.post('/', authenticateToken, createBooking);
router.patch('/:id', authenticateToken, updateBookingStatus);

export default router;
