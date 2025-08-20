import { Router } from 'express';
import { getHistorical } from '../controllers/data.controller.js';
import { verifyJWT } from '../middleware/auth.js';

const router = Router();
// GET /api/data?range=24h|7d|30d&symbol=BTCUSDT&interval=1m
router.get('/', verifyJWT, getHistorical);
export default router;
