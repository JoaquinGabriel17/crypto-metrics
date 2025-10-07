import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import generateUniqueUsername from "../utils/generateUniqueUsername.js";

// CREAR UN USUARIO
export async function register(req, res, next) {
  try {
    const { email, password,  name } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email ya registrado' });
    const passwordHash = await bcrypt.hash(password, 10);

    let finalName = name;
    if (!finalName || finalName.trim() === "") {
      finalName = await generateUniqueUsername(); // genera uno automático
    }

    const user = await User.create({ email, passwordHash, name: finalName });
    return res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (e) { next(e); }
}

// LOGIN DE USUARIO
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

    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    return res.json({ message: 'Usuario eliminado correctamente' });
  } catch (e) {
    next(e);
  }
}


// ACTUALIZAR  email y/o nombre
export async function updateUser(req, res, next) {
  try {
    const { email, name, id } = req.body;

    // Armamos un objeto con solo los campos que vienen
    const updates = {};
    if (email) updates.email = email;
    if (name) updates.name = name;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No se enviaron campos para actualizar" });
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json({
      id: updatedUser._id,
      email: updatedUser.email,
      name: updatedUser.name,
    });
  } catch (e) {
    next(e);
  }
}

