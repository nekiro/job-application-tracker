import mongoose from 'mongoose';
import { encrypt, compareHash } from '../utils/crypt';

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, default: 'User' },
});

UserSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await encrypt(this.password);
  }
});

// never show password
UserSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

UserSchema.method('validatePassword', async function (plain) {
  return await compareHash(plain, this.password);
});

export default mongoose.model('User', UserSchema);
