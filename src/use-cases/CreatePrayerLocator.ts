import {injectable} from 'inversify';

import Joi from '@hapi/joi';

import PrayerModel, {IPrayerModel} from '../database/PrayerModel';
import checkValidationData, {ValidationDataResult} from './helper/checkValidationData';

type CreatePrayerDataSchema = {
  email?: string;
  phone: string;
  firstName: string;
  lastName: string;
  reservePrayingTime: string;
  token: string;
};

const createPrayerValidationSchema = Joi.object<CreatePrayerDataSchema>({
  email: Joi.string().optional(),
  phone: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  reservePrayingTime: Joi.string().valid('11:30', '13:30').required(),
  token: Joi.string().required(),
});

@injectable()
class CreatePrayerLocator {
  public validate(data: CreatePrayerDataSchema): Joi.ValidationResult {
    return createPrayerValidationSchema.validate(data, {abortEarly: false});
  }

  public async createPrayer(data: ValidationDataResult<CreatePrayerDataSchema>): Promise<IPrayerModel | Error> {
    try {
      const error = checkValidationData(data);
      if (error) {
        throw error;
      }
      const {value} = data;
      const isExists = await PrayerModel.findOne({token: value.token}).countDocuments().exec();
      if (isExists) {
        throw new Error('Record already exists!');
      }
      const newPrayer = await PrayerModel.create({
        name: {
          last: value.lastName,
          first: value.firstName,
        },
        reservePrayingTime: value.reservePrayingTime,
        phone: value.phone,
        token: value.token,
      });
      const savedPrayer = newPrayer.save();
      return savedPrayer;
    } catch (error) {
      return error;
    }
  }
}

export default CreatePrayerLocator;
