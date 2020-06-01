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

const GetNextFridayInfoController = async (req: Request, res: Response) => {
  const settingModel = container.get<GetSettingLocator>(TYPES.GetSetting);
  const prayerModel = container.get<GetPrayerLocator>(TYPES.GetPrayer);

  const nextFriday = getNextFridayDate();
  const previousFriday = getNextFridayDate().subtract(1, 'week');

  const firstPrayersGroupCount = await prayerModel.getCurrentWeekPrayersCountOfTime(
    previousFriday,
    nextFriday,
    '11:30'
  );
  const secondPrayersGroupCount = await prayerModel.getCurrentWeekPrayersCountOfTime(
    previousFriday,
    nextFriday,
    '13:30'
  );

  const setting = await settingModel.getSetting();
  const settingObject = setting?.toObject() as ISetting;

  const data = {
    settings: {
      nextFridayData: nextFriday.format('YYYY-MM-DD'),
      firstPraying: {
        ...settingObject.firstPraying,
        personSpaceLeft: settingObject.firstPraying.personSpaceLeft - (firstPrayersGroupCount || 0),
      },
      secondPraying: {
        ...settingObject.secondPraying,
        personSpaceLeft: settingObject.secondPraying.personSpaceLeft - (secondPrayersGroupCount || 0),
      },
    },
    prayer: {
      token: `${ulid()}.${ulid()}.${ulid()}`,
      name: {
        first: '',
        last: '',
      },
      phoneNumber: '',
    },
  };
  res.send(data);
};

const PostNextFridayInfoController = async (req: Request, res: Response) => {
  const settingModel = container.get<GetSettingLocator>(TYPES.GetSetting);
  const prayerModel = container.get<GetPrayerLocator>(TYPES.GetPrayer);

  const nextFriday = getNextFridayDate();
  const previousFriday = getNextFridayDate().subtract(1, 'week');

  const firstPrayersGroupCount = await prayerModel.getCurrentWeekPrayersCountOfTime(
    previousFriday,
    nextFriday,
    '11:30'
  );

  const secondPrayersGroupCount = await prayerModel.getCurrentWeekPrayersCountOfTime(
    previousFriday,
    nextFriday,
    '13:30'
  );

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

  const validatedData = prayerModel.validate(req.body);
  if (validatedData.error) {
    res.status(422).send({
      code: 'InvalidReceivedData',
      error: validatedData.error.message,
    });
    return;
  }

  const prayerObject = await prayerModel.getPrayer(validatedData);
  if (prayerObject) {
    prayer = {
      ...prayerObject?.toObject(),
    };
  } else {
    res.status(422).send({
      code: 'InvalidTokenOrEntryNotFound',
      error: 'Invalid token or entry not found!',
    });
    return;
  }

  const data = {
    settings: {
      nextFridayData: nextFriday.format('YYYY-MM-DD'),
      firstPraying: {
        ...settingObject.firstPraying,
        personSpaceLeft: settingObject.firstPraying.personSpaceLeft - (firstPrayersGroupCount || 0),
      },
      secondPraying: {
        ...settingObject.secondPraying,
        personSpaceLeft: settingObject.secondPraying.personSpaceLeft - (secondPrayersGroupCount || 0),
      },
    },
    prayer,
  };
  res.send(data);
};

NextFridayInfoRoute.get('/friday-praying', GetNextFridayInfoController);
NextFridayInfoRoute.post('/friday-praying', PostNextFridayInfoController);
export default NextFridayInfoRoute;
