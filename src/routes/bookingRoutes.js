import express from 'express';
import {
  // Pastikan semua fungsi yang diimpor benar-benar ada di controller
  getAllBookings,
  getBookingById,
  updateBooking, // Kita menggunakan ini, bukan updateBookingStatus
  deleteBooking,
  createBooking, // Fungsi ini masih ada untuk membuat booking baru
} from '../controllers/bookingController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Lindungi semua rute ini, hanya user yang login yang bisa mengakses
router.use(authenticateToken);

router.get('/', getAllBookings);
router.get('/:id', getBookingById);
router.post('/', createBooking); // Rute untuk membuat booking baru
router.patch('/:id', updateBooking); // Rute untuk update (termasuk status)
router.delete('/:id', deleteBooking); // Rute untuk menghapus booking

export default router;
