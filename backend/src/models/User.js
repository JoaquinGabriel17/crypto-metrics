import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  passwordHash: { type: String, required: true },
  name: {type: String, unique: true}
}, { timestamps: true });

export default mongoose.model('User', UserSchema);