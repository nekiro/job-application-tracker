import mongoose from 'mongoose';

// not really used currently, but maybe it will be useful later

import { CompanySchema as Company } from './company';

export const JobStatus = Object.freeze({
  APPLIED: 1,
  HR: 2,
  TECH: 3,
  ACCEPTED: 4,
  REJECTED: 5,
});

export const JobLevel = Object.freeze({
  JUNIOR: 1,
  MID: 2,
  SENIOR: 3,
});

export const JobSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: Number, required: true },
  status: { type: Number, default: JobStatus.APPLIED },
  appliedAt: { type: Date, default: Date.now },
  company: { type: Company, required: true },
});

JobSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret, _options) => {
    delete ret.__v;
    delete ret._id;
    return ret;
  },
});

JobSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

export const Job = mongoose.model('Job', JobSchema);
