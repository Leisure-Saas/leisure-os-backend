import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';

// Impor semua fungsi yang dibutuhkan dari controller, termasuk yang baru
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking, // Pastikan ini yang diimpor, bukan updateBookingStatus
  deleteBooking,
} from '../controllers/bookingController.js';

const router = express.Router();

// =======================================================
// RUTE PUBLIK - Siapa saja bisa melihat data booking
// =======================================================
router.get('/', getAllBookings);
router.get('/:id', getBookingById);

// =======================================================
// RUTE TERPROTEKSI - Hanya pengguna yang login yang bisa mengakses
// =======================================================

// Membuat booking baru
router.post('/', authenticateToken, createBooking);

// Memperbarui booking berdasarkan ID (lebih umum)
router.patch('/:id', authenticateToken, updateBooking);

// Menghapus booking berdasarkan ID
router.delete('/:id', authenticateToken, deleteBooking);

export default router;
