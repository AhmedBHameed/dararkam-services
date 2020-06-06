import express from 'express';
import {Container} from 'inversify';

import Errors, {ErrorDictionary} from '../../config/errors';
import IOC from '../../loaders/inversionOfControl';
import TYPES from '../../models/DI/types';
import UpdatePrayerLocator from '../../use-cases/UpdatePryerLocator';
import ControllerHandler, {IApiResponse, IHttpRequestHelper} from '../ControllerHandler';

const container: Container = IOC();

const UpdatePrayerRoute = express.Router();

const UpdatePrayerController = async (httpRequestHelper: IHttpRequestHelper): Promise<IApiResponse> => {
  const updatePryerModel = container.get<UpdatePrayerLocator>(TYPES.UpdatePryer);

  const validatedData = updatePryerModel.validate(httpRequestHelper.body);
  console.log('updatedPryer', validatedData);
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

  const updatedPryer = await updatePryerModel.updatePrayer(validatedData);
  if (updatedPryer instanceof Error) {
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
      statusCode: 422,
    };
  }
  return {
    body: {
      data: updatedPryer,
    },
    statusCode: 200,
  };
};

UpdatePrayerRoute.post('/update-prayer', ControllerHandler(UpdatePrayerController));
export default UpdatePrayerRoute;
