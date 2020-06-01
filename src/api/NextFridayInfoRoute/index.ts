import express, {Request, Response} from 'express';
import {Container} from 'inversify';
import {ulid} from 'ulid';

import {ISetting} from '../../database/SettingModel';
import IOC from '../../loaders/inversionOfControl';
import TYPES from '../../models/DI/types';
import GetPrayerLocator from '../../use-cases/GetPrayerLocator';
import GetSettingLocator from '../../use-cases/GetSettingLocator';
import {getNextFridayDate} from '../../util/time';

const container: Container = IOC();

const NextFridayInfoRoute = express.Router();

const PostNextFridayInfoController = async (req: Request, res: Response) => {
  const settingModel = container.get<GetSettingLocator>(TYPES.GetSetting);
  const prayerModel = container.get<GetPrayerLocator>(TYPES.GetPrayer);

  const token = `${ulid()}.${ulid()}.${ulid()}`;
  let prayer = {
    token,
    name: {
      first: '',
      last: '',
    },
    phoneNumber: '',
  };

  const setting = await settingModel.getSetting();
  const settingObject = setting?.toObject() as ISetting;

  if (req.body.token) {
    const validatedBody = prayerModel.validate(req.body);
    const prayerObject = await prayerModel.getPrayer(validatedBody);
    if (prayerObject) {
      prayer = {
        ...prayerObject?.toObject(),
      };
    }
  }

  const data = {
    settings: {
      nextFridayData: getNextFridayDate(),
      firstPraying: settingObject.firstPraying,
      secondPraying: settingObject.secondPraying,
    },
    prayer,
  };
  res.send(data);
};

NextFridayInfoRoute.post('/friday-praying', PostNextFridayInfoController);
export default NextFridayInfoRoute;
