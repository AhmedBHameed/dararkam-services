import {injectable} from 'inversify';

import Joi from '@hapi/joi';

import PrayerModel, {IPrayerModel} from '../database/PrayerModel';
import checkValidationData, {ValidationDataResult} from './helper/checkValidationData';

interface updatePrayerDataSchema {
  id: string;
  email?: string;
  phone: string;
  firstName: string;
  lastName: string;
  reservePrayingTime: string;
  token: string;
}

const updatePrayerValidationSchema = Joi.object<updatePrayerDataSchema>({
  id: Joi.string().optional(),
  email: Joi.string().optional(),
  phone: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  reservePrayingTime: Joi.string().valid('11:30', '13:30').required(),
  token: Joi.string().optional(),
});

@injectable()
class UpdatePrayerLocator {
  public validate(data: updatePrayerDataSchema): Joi.ValidationResult {
    return updatePrayerValidationSchema.validate(data, {abortEarly: false});
  }

  public async updatePrayer(data: ValidationDataResult<updatePrayerDataSchema>): Promise<IPrayerModel | undefined> {
    try {
      const error = checkValidationData(data);
      if (error) {
        throw error;
      }
      const {value} = data;
      const updatePrayer = await PrayerModel.findOneAndUpdate(
        {token: value.token},
        {
          name: {
            first: value.firstName,
            last: value.lastName,
          },
          reservePrayingTime: value.reservePrayingTime,
          phone: value.phone,
        },
        {new: true}
      ).select('-token');
      if (!updatePrayer) {
        throw new Error('Invalid token or record not found!');
      }
      const updatedPryer = await updatePrayer?.save();
      return updatedPryer;
    } catch (error) {
      return error;
    }
  }
}

export default UpdatePrayerLocator;
