// src/routes/bookingRoutes.js
import express from 'express';

// Impor semua fungsi yang dibutuhkan dari controller
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus, // <-- Impor fungsi baru
} from '../controllers/bookingController.js';

const router = express.Router();

// Mendefinisikan semua rute untuk booking
router.get('/', getAllBookings);
router.get('/:id', getBookingById);
router.post('/', createBooking);
router.patch('/:id', updateBookingStatus); // <-- Tambahkan rute PATCH baru

export default router;
