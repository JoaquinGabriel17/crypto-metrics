import { Router } from 'express';
import { getFilters } from '../controllers/filters.controller.js';
import { verifyJWT } from '../middleware/auth.js';

const router = Router();
router.get('/', verifyJWT, getFilters);
export default router;