import express, {Request, Response} from 'express';
import {Container} from 'inversify';
import IOC from '../../loaders/inversionOfControl';
import TYPES from '../../models/DI/types';
import CreatePrayerLocator from 'src/use-cases/CreatePrayerLocator';

const container: Container = IOC();

const CreatePrayerRoute = express.Router();

const CreatePrayerController = async (req: Request, res: Response) => {
  const createPryerModel = container.get<CreatePrayerLocator>(TYPES.CreatePrayer);

  const validatedData = createPryerModel.validate(req.body);

  if (validatedData.error) {
    res.status(422).send({
      code: 'InvalidReceivedData',
      error: validatedData.error.message,
    });
  }

  const createdPryer = await createPryerModel.createPrayer(validatedData);
  res.send(createdPryer?.toObject());
};

CreatePrayerRoute.post('/create-prayer', CreatePrayerController);
export default CreatePrayerRoute;
