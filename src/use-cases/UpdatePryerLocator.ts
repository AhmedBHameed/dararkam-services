import PrayerModel, {IPrayerModel, IPrayer} from '../database/PrayerModel';
import Joi from '@hapi/joi';
import {injectable} from 'inversify';
import checkValidationData, {ValidationDataResult} from './helper/checkValidationData';

type updatePrayerDataSchema = IPrayer;

const updatePrayerValidationSchema = Joi.object<updatePrayerDataSchema>({
  id: Joi.string().optional(),
  email: Joi.string().optional(),
  phone: Joi.string().required(),
  name: Joi.object({
    first: Joi.string().required(),
    last: Joi.string().required(),
  }),
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
          name: value.name,
          phone: value.phone,
        },
        {new: true}
      );
      const updatedPryer = await updatePrayer?.save();
      return updatedPryer;
    } catch (error) {
      return error;
    }
  }
}

export default UpdatePrayerLocator;
