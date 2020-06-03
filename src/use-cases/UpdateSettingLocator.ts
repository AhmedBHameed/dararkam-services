import {injectable} from 'inversify';

import Joi from '@hapi/joi';

import SettingModel, {ISettingModel} from '../database/SettingModel';
import checkValidationData, {ValidationDataResult} from './helper/checkValidationData';

interface SettingDataSchema {
  id?: any;
  firstPrayingTime?: string;
  secondPrayingTime?: string;
  maxPrayerCount?: number;
}

const settingValidationSchema = Joi.object<SettingDataSchema>({
  id: Joi.string().optional(),
  firstPrayingTime: Joi.date().required(),
  secondPrayingTime: Joi.date().required(),
  maxPrayerCount: Joi.number().required(),
});

@injectable()
class UpdateSettingLocator {
  public validate(data: SettingDataSchema): Joi.ValidationResult {
    return settingValidationSchema.validate(data, {abortEarly: false});
  }

  public async updateSetting(data: ValidationDataResult<SettingDataSchema>): Promise<ISettingModel | null> {
    try {
      const error = checkValidationData(data);
      if (error) {
        throw error;
      }
      const {value} = data;
      const setting = await SettingModel.findByIdAndUpdate(
        value.id,
        {
          firstPrayingTime: value.firstPrayingTime,
          secondPrayingTime: value.secondPrayingTime,
          maxPrayerCount: value.maxPrayerCount,
        },
        {new: true}
      );
      return setting;
    } catch (error) {
      return error;
    }
  }
}

export default UpdateSettingLocator;
