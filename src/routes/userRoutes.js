import express from 'express';
import { getMyProfile, updateMyProfile } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Semua rute di file ini akan dilindungi oleh middleware otentikasi
router.use(authenticateToken);

// GET /api/users/me -> Mendapatkan profil user yang sedang login
router.get('/me', getMyProfile);

// PUT /api/users/me -> Memperbarui profil user yang sedang login
router.put('/me', updateMyProfile);

export default router;
