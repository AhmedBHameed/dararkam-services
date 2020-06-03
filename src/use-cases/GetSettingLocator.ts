import {injectable} from 'inversify';

import SettingModel, {ISettingModel} from '../database/SettingModel';

interface SettingDataSchema {
  id?: any;
  firstPrayingTime?: string;
  secondPrayingTime?: string;
  maxPrayerCount?: number;
}

@injectable()
class GetSettingLocator {
  public async getSetting(): Promise<ISettingModel | null> {
    try {
      const storedSetting = await SettingModel.findOne().exec();

      if (!storedSetting) {
        const setting = await SettingModel.create({
          firstPraying: {
            time: '11:30',
            personSpaceLeft: 60,
          },
          secondPraying: {
            time: '13:30',
            personSpaceLeft: 60,
          },
        });
        const savedSetting = await setting.save();
        return savedSetting;
      }
      return storedSetting;
    } catch (error) {
      return error;
    }
  }
}

export default GetSettingLocator;
