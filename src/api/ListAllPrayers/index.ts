import express from 'express';
import {Container} from 'inversify';

import IOC from '../../loaders/inversionOfControl';
import TYPES from '../../models/DI/types';
import GetPrayerLocator from '../../use-cases/GetPrayerLocator';
import ControllerHandler, {IApiResponse, IHttpRequestHelper} from '../ControllerHandler';

const container: Container = IOC();

const ListAllPrayersRoute = express.Router();

const ListAllPrayersController = async (_httpRequestHelper: IHttpRequestHelper): Promise<IApiResponse> => {
  const prayerModel = container.get<GetPrayerLocator>(TYPES.GetPrayer);

  const data = await prayerModel.getPrayers();
  return {
    body: {
      data,
    },
    statusCode: 200,
  };
};

ListAllPrayersRoute.get('/all-prayers', ControllerHandler(ListAllPrayersController));
export default ListAllPrayersRoute;
