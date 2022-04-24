import mongoose from 'mongoose';

// not really used currently, but maybe it will be useful later

export const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  website: { type: String, default: '' },
  size: { type: Number, default: 0 },
});

CompanySchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret, _options) => {
    delete ret.__v;
    delete ret._id;
    return ret;
  },
});

CompanySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

export const Company = mongoose.model('Company', CompanySchema);
