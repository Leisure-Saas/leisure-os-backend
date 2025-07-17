import express from 'express';
// Impor semua handler yang kita ekspor dari controller
import { 
  getAllRules, 
  createRule, 
  suggestPriceHandler 
} from './rules.controller.js';

const router = express.Router();

// Route untuk fungsionalitas CRUD Rules
router.get('/', getAllRules);
router.post('/', createRule);

// Route baru untuk fitur AI
router.post('/suggest-price', suggestPriceHandler);


export default router;
