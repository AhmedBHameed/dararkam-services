import PrayerModel, {IPrayerModel} from '../database/PrayerModel';
import {injectable} from 'inversify';
import Joi from '@hapi/joi';
import checkValidationData, {ValidationDataResult} from './helper/checkValidationData';
import {Moment} from 'moment';

interface PrayerDataSchema {
  token: string;
}

const getPrayerValidationSchema = Joi.object<PrayerDataSchema>({
  token: Joi.string().required(),
});

@injectable()
class GetPrayerLocator {
  public validate(data: PrayerDataSchema): Joi.ValidationResult {
    return getPrayerValidationSchema.validate(data, {abortEarly: false});
  }

  public async getPrayers(): Promise<IPrayerModel[] | null> {
    try {
      const prayers = await PrayerModel.find();
      return prayers;
    } catch (error) {
      return error;
    }
  }

  public async getPrayer(data: ValidationDataResult<PrayerDataSchema>): Promise<IPrayerModel | null> {
    const error = checkValidationData(data);
    if (error) {
      throw error;
    }
    const {value} = data;
    try {
      const prayer = await PrayerModel.findOne({token: value.token});
      return prayer;
    } catch (error) {
      return error;
    }
  }

  public async getCurrentWeekPrayersCountOfTime(
    previousFriday: Moment,
    nextAfter: Moment,
    reservePrayingTime: '11:30' | '13:30'
  ): Promise<number | null> {
    try {
      const prayers = await PrayerModel.find({
        updatedAt: {$gte: previousFriday.toDate(), $lt: nextAfter.toDate()},
        reservePrayingTime,
      })
        .countDocuments()
        .exec();
      return prayers;
    } catch (error) {
      return error;
    }
  }
}

export default GetPrayerLocator;
