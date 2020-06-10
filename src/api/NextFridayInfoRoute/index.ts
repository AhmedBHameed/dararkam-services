import express from 'express';
import {Container} from 'inversify';
import {ulid} from 'ulid';

import Errors, {ErrorDictionary} from '../../config/errors';
import {ISetting} from '../../database/SettingModel';
import IOC from '../../loaders/inversionOfControl';
import TYPES from '../../models/DI/types';
import GetPrayerLocator from '../../use-cases/GetPrayerLocator';
import GetSettingLocator from '../../use-cases/GetSettingLocator';
import {getNextFridayDate} from '../../util/time';
import ControllerHandler, {IApiResponse, IHttpRequestHelper} from '../ControllerHandler';

const container: Container = IOC();

const NextFridayInfoRoute = express.Router();

const GetNextFridayInfoController = async (_httpRequestHelper: IHttpRequestHelper): Promise<IApiResponse> => {
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
  return {
    body: {
      data,
    },
    statusCode: 200,
  };
};

const PostNextFridayInfoController = async (httpRequestHelper: IHttpRequestHelper): Promise<IApiResponse> => {
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

  const validatedData = prayerModel.validate(httpRequestHelper.body);
  if (validatedData.error) {
    throw {
      body: {
        data: null,
        errors: [
          {
            code: Errors.ValidationDataError,
            message: validatedData.error.message,
          },
        ],
      },
      statusCode: 422,
    };
  }

  const prayerObject = await prayerModel.getPrayer(validatedData);
  if (prayerObject) {
    prayer = {
      ...prayerObject?.toObject(),
    };
  } else {
    throw {
      body: {
        data: null,
        errors: [
          {
            code: Errors.InvalidTokenOrEntryNotFound,
            message: ErrorDictionary.InvalidTokenOrEntryNotFound.message,
          },
        ],
      },
      statusCode: ErrorDictionary.InvalidTokenOrEntryNotFound.statusCode,
    };
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

  return {
    body: {
      data,
    },
    statusCode: 200,
  };
};

NextFridayInfoRoute.get('/friday-praying', ControllerHandler(GetNextFridayInfoController));
NextFridayInfoRoute.post('/friday-praying', ControllerHandler(PostNextFridayInfoController));
export default NextFridayInfoRoute;
