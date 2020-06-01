import PrayerModel, {IPrayerModel} from '../database/PrayerModel';
import Joi from '@hapi/joi';
import {injectable} from 'inversify';
import checkValidationData, {ValidationDataResult} from './helper/checkValidationData';

type CreatePrayerDataSchema = {
  email?: string;
  phone: string;
  firstName: string;
  lastName: string;
  token: string;
};

const createPrayerValidationSchema = Joi.object<CreatePrayerDataSchema>({
  email: Joi.string().optional(),
  phone: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  token: Joi.string().required(),
});

@injectable()
class CreatePrayerLocator {
  public validate(data: CreatePrayerDataSchema): Joi.ValidationResult {
    return createPrayerValidationSchema.validate(data, {abortEarly: false});
  }

  public async createPrayer(data: ValidationDataResult<CreatePrayerDataSchema>): Promise<IPrayerModel | null> {
    try {
      const error = checkValidationData(data);
      if (error) {
        throw error;
      }
      const {value} = data;
      const newPrayer = await PrayerModel.create({
        name: {
          last: value.lastName,
          first: value.firstName,
        },
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
