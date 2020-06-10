import express from 'express';
import {Container} from 'inversify';

import IOC from '../../loaders/inversionOfControl';
import TYPES from '../../models/DI/types';
import GetPrayerLocator from '../../use-cases/GetPrayerLocator';
import ControllerHandler, {IApiResponse, IHttpRequestHelper} from '../ControllerHandler';
import {getNextFridayDate} from '../../util/time';

const container: Container = IOC();

const ListAllPrayersRoute = express.Router();

const ListAllPrayersController = async (_httpRequestHelper: IHttpRequestHelper): Promise<IApiResponse> => {
  const prayerModel = container.get<GetPrayerLocator>(TYPES.GetPrayer);

  const nextFriday = getNextFridayDate();
  const previousFriday = getNextFridayDate().subtract(1, 'week');

  const data = await prayerModel.getCurrentWeekPrayers(previousFriday, nextFriday);
  if (data instanceof Error) {
    throw {
      body: {
        data: null,
        errors: [
          {
            code: 'InternalServerError',
            error: 'Internal server error',
          },
        ],
      },
      statusCode: 422,
    };
  }
  return {
    body: {
      data,
    },
    statusCode: 200,
  };
};

ListAllPrayersRoute.get('/all-prayers', ControllerHandler(ListAllPrayersController));
export default ListAllPrayersRoute;
