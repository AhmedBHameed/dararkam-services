import {Document, Schema, Types, model} from 'mongoose';
import {utcTime} from '../util/time';

export interface ISetting {
  id?: any;
  firstPraying: {
    time: string;
    personSpaceLeft: number;
  };
  secondPraying: {
    time: string;
    personSpaceLeft: number;
  };
}

export interface ISettingModel extends ISetting, Document {}

const SettingSchema = new Schema(
  {
    id: {type: Types.ObjectId},
    firstPraying: {
      type: {
        time: {type: String, required: true},
        personSpaceLeft: {type: Number, required: true},
      },
    },
    secondPraying: {
      type: {
        time: {type: String, required: true},
        personSpaceLeft: {type: Number, required: true},
      },
    },
  },
  {timestamps: true}
);

SettingSchema.pre<ISettingModel>('save', function (this, next) {
  const utc = utcTime().valueOf().toString();
  if (!this['createdAt']) {
    this['createdAt'] = utc;
  }
  this['updatedAt'] = utc;
  next();
});

const SettingModel = model<ISettingModel>('Setting', SettingSchema);
export default SettingModel;
