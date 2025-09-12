import { Router } from 'express';
import { login, register, deleteUser, getFavorites, updateFavorites } from '../controllers/auth.controller.js';
import { verifyJWT } from '../middleware/auth.js';
import { sendEmail } from '../controllers/emailController.js';
import { updateUser } from "../controllers/auth.controller.js";



const router = Router();
router.post('/register', register);
router.post('/login', login);
router.delete('/delete/:id', deleteUser);
router.post('/send-email', sendEmail);
router.put("/update-user",verifyJWT, updateUser);
router.get("/favorites",  getFavorites);
router.put("/favorites", updateFavorites);


export default router;