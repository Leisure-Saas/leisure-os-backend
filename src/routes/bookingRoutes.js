// src/routes/bookingRoutes.js
import express from 'express';
import { createBooking } from '../controllers/bookingController.js';

const router = express.Router();

// Saat ada request POST ke /api/bookings, jalankan fungsi createBooking
router.post('/', createBooking);

// TODO: Tambahkan rute GET untuk melihat booking nanti.

export default router;
