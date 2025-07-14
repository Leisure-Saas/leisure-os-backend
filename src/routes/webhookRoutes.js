// src/routes/webhookRoutes.js
import express from 'express';
import { handleXenditWebhook } from '../controllers/webhookController.js';

const router = express.Router();

// Endpoint ini tidak memerlukan otentikasi user, karena dipanggil oleh Xendit
router.post('/xendit', handleXenditWebhook);

export default router;
