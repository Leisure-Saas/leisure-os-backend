import { Router } from 'express';
import { createRule, getAllRules } from './rules.controller.js';

const router = Router({ mergeParams: true });
router.post('/', createRule);
router.get('/', getAllRules);
export default router;
