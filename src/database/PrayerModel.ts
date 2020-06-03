import {Document, model, Schema, Types} from 'mongoose';

import {utcTime} from '../util/time';

export interface IPrayer {
  id?: any;
  email?: string;
  phone?: string;
  name?: {
    first?: string;
    last?: string;
  };
  reservePrayingTime?: string;
  token?: string;
}

export interface IPrayerModel extends IPrayer, Document {}

const PrayerSchema = new Schema(
  {
    id: {type: Types.ObjectId},
    name: {type: {first: String, last: String}, default: {first: '', last: ''}},
    email: {type: String},
    phone: {type: String, required: true},
    reservePrayingTime: {type: String, required: true},
    token: {type: String, required: true},
  },
  {timestamps: true}
);

PrayerSchema.pre<IPrayerModel>('save', function (this, next) {
  const utc = utcTime().valueOf().toString();
  if (!this['createdAt']) {
    this['createdAt'] = utc;
  }
  this['updatedAt'] = utc;
  next();
});

const PrayerModel = model<IPrayerModel>('Prayer', PrayerSchema);
export default PrayerModel;
