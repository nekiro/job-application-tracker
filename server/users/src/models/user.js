import mongoose from 'mongoose';
import { encrypt, compareHash, generateSalt } from '../utils/crypt';
import { Role } from '../middlewares/role';

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  tokenSecret: { type: String, required: true, unique: true },
  role: { type: Number, default: Role.USER },
});

UserSchema.pre('validate', async function (next) {
  if (this.isNew) {
    this.tokenSecret = await this.generateTokenSecret();
  }

  if (this.isModified('password')) {
    this.password = await encrypt(this.password);
  }
  next();
});

// never show password
UserSchema.set('toJSON', {
  transform: (doc, ret, _options) => {
    delete ret.password;
    delete ret.tokenSecret;
    delete ret.__v;
    return ret;
  },
});

UserSchema.method('validatePassword', async function (plain) {
  return await compareHash(plain, this.password);
});

UserSchema.method('generateTokenSecret', async function () {
  return await generateSalt(6);
});

UserSchema.method('resetTokenSecret', async function () {
  this.tokenSecret = await this.generateTokenSecret();
  await this.save();
});

export default mongoose.model('User', UserSchema);
