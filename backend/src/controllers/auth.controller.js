import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import generateUniqueUsername from "../utils/generateUniqueUsername.js";


export async function register(req, res, next) {
  try {
    const { email, password, role, name } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email ya registrado' });
    const passwordHash = await bcrypt.hash(password, 10);

    let finalName = name;
    if (!finalName || finalName.trim() === "") {
      finalName = await generateUniqueUsername(); // genera uno automático
    }

    const user = await User.create({ email, passwordHash, name: finalName, role: role === 'admin' ? 'admin' : 'user' });
    return res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (e) { next(e); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Credenciales inválidas' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: 'Credenciales inválidas' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch (e) { next(e); }
}

export async function deleteUser(req, res, next) {
  try {
    const { id } = req.params; // se espera que venga en la URL: /users/:id
    console.log(id)

    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    return res.json({ message: 'Usuario eliminado correctamente' });
  } catch (e) {
    next(e);
  }
}
