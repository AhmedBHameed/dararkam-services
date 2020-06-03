import express from 'express';
import {Container} from 'inversify';

import Errors, {ErrorDictionary} from '../../config/errors';
import IOC from '../../loaders/inversionOfControl';
import TYPES from '../../models/DI/types';
import DeletePrayerLocator from '../../use-cases/DeletePrayerLocator';
import ControllerHandler, {IApiResponse, IHttpRequestHelper} from '../ControllerHandler';

const container: Container = IOC();

const DeletePrayerRoute = express.Router();

const DeletePrayerController = async (httpRequestHelper: IHttpRequestHelper): Promise<IApiResponse> => {
  const deletePryerModel = container.get<DeletePrayerLocator>(TYPES.DeletePrayer);
  const validatedData = deletePryerModel.validate({token: httpRequestHelper.params.token});

  if (validatedData.error) {
    throw {
      body: {
        data: null,
        errors: [
          {
            code: 'InvalidReceivedData',
            message: validatedData.error.message,
          },
        ],
      },
      statusCode: 422,
    };
  }

  const updatedPryer = await deletePryerModel.deletePrayer(validatedData);
  if (updatedPryer) {
    return {
      body: {
        data: {message: 'Record has been deleted successfully.'},
      },
      statusCode: 200,
    };
  } else {
    throw {
      body: {
        data: null,
        errors: [
          {
            code: Errors.InvalidDeleteTokenOrNotFound,
            message: ErrorDictionary.InvalidDeleteTokenOrNotFound.message,
          },
        ],
      },
      statusCode: ErrorDictionary.InvalidDeleteTokenOrNotFound.statusCode,
    };
  }
};

DeletePrayerRoute.delete('/delete-prayer/:token?', ControllerHandler(DeletePrayerController));
export default DeletePrayerRoute;
