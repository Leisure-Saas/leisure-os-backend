// src/routes/bookingRoutes.js
import express from 'express';

// Impor semua fungsi yang dibutuhkan
import {
  createBooking,
  getAllBookings,
  getBookingById
} from '../controllers/bookingController.js';

const router = express.Router();

// Definisikan semua rute untuk booking
router.get('/', getAllBookings);     // GET /api/bookings -> dapatkan semua booking
router.get('/:id', getBookingById); // GET /api/bookings/:id -> dapatkan satu booking
router.post('/', createBooking);      // POST /api/bookings -> buat booking baru

export default router;
