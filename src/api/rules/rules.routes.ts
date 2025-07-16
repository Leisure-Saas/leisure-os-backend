import express from 'express';
// PENTING: Impor semua handler yang dibutuhkan dengan ekstensi .js
import { 
  createRule, 
  getAllRules, 
  suggestPriceHandler 
} from './rules.controller.js';

const router = express.Router();

// Route-route yang sudah ada sebelumnya
router.get('/', getAllRules);
router.post('/', createRule);

// Route baru untuk AI Price Suggestion
router.post('/suggest-price', suggestPriceHandler);


export default router;
