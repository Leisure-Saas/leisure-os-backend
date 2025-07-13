import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// Rute untuk registrasi
router.post('/register', register);

// Rute untuk login
router.post('/login', login);

export default router;
