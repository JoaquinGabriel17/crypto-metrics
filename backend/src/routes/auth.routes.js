import { Router } from 'express';
import { login, register, deleteUser } from '../controllers/auth.controller.js';
import { verifyJWT, requireRole } from '../middleware/auth.js';

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.delete('/delete/:id', verifyJWT, requireRole, deleteUser);

export default router;