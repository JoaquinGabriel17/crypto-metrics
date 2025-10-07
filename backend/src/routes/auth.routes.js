import { Router } from 'express';
import { login, register,updateUser  } from '../controllers/auth.controller.js';
import { verifyJWT } from '../middleware/auth.js';



const router = Router();

router.post('/register', register);
router.post('/login', login);
router.put("/update-user",verifyJWT, updateUser);



export default router;