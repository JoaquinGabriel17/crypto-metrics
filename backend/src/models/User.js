import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  passwordHash: { type: String, required: true },
  name: {type: String, unique: true},
  favorites: { type: [String], default: []}, // Array de IDs de criptomonedas favoritas
  favorites_data_cache: {type: [Object], default: []}, // Cache de datos de criptomonedas favoritas
  favorites_last_updated: { type: Date, default: null }, // Última actualización del cache
}, { timestamps: true });

export default mongoose.model('User', UserSchema);