import express from 'express';
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking
} from '../controllers/bookingController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Lindungi semua rute, hanya user terotentikasi yang bisa akses
router.use(authenticateToken);

router.get('/', getAllBookings);
router.post('/', createBooking);
router.get('/:id', getBookingById);
router.patch('/:id', updateBooking);
router.delete('/:id', deleteBooking);

export default router;
