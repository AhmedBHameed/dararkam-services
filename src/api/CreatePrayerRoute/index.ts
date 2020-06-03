import express from 'express';
import {Container} from 'inversify';
import CreatePrayerLocator from 'src/use-cases/CreatePrayerLocator';

import Errors from '../../config/errors';
import IOC from '../../loaders/inversionOfControl';
import TYPES from '../../models/DI/types';
import ControllerHandler, {IApiResponse, IHttpRequestHelper} from '../ControllerHandler';

const container: Container = IOC();

const CreatePrayerRoute = express.Router();

const CreatePrayerController = async (httpRequestHelper: IHttpRequestHelper): Promise<IApiResponse> => {
  const createPryerModel = container.get<CreatePrayerLocator>(TYPES.CreatePrayer);

  const validatedData = createPryerModel.validate(httpRequestHelper.body);

  if (validatedData.error) {
    throw {
      body: {
        data: null,
        errors: [
          {
            code: Errors.ValidationDataError,
            error: validatedData.error.message,
          },
        ],
      },
      statusCode: 422,
    };
  }

  const createdPrayer = await createPryerModel.createPrayer(validatedData);
  if (createdPrayer instanceof Error) {
    throw {
      body: {
        data: null,
        errors: [
          {
            code: Errors.RecordAlreadyExists,
            error: createdPrayer.message,
          },
        ],
      },
      statusCode: 422,
    };
  }
  return {
    body: {
      data: createdPrayer,
    },
    statusCode: 200,
  };
};

CreatePrayerRoute.post('/create-prayer', ControllerHandler(CreatePrayerController));
export default CreatePrayerRoute;
