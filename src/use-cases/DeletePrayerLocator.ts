import {injectable} from 'inversify';

import Joi from '@hapi/joi';

import PrayerModel, {IPrayerModel} from '../database/PrayerModel';
import checkValidationData, {ValidationDataResult} from './helper/checkValidationData';

type DeletePrayerDataSchema = {
  token: string;
};

const deletePrayerValidationSchema = Joi.object<DeletePrayerDataSchema>({
  token: Joi.string().required(),
});

@injectable()
class DeletePrayerLocator {
  public validate(data: DeletePrayerDataSchema): Joi.ValidationResult {
    return deletePrayerValidationSchema.validate(data, {abortEarly: false});
  }

  public async deletePrayer(data: ValidationDataResult<DeletePrayerDataSchema>): Promise<IPrayerModel | null> {
    try {
      const error = checkValidationData(data);
      if (error) {
        throw error;
      }
      const {value} = data;
      const isSuccess = await PrayerModel.findOneAndDelete({
        token: value.token,
      });
      return isSuccess;
    } catch (error) {
      return error;
    }
  }
}

export default DeletePrayerLocator;
