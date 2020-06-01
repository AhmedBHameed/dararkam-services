import express, {Request, Response} from 'express';
import {Container} from 'inversify';
import IOC from '../../loaders/inversionOfControl';
import TYPES from '../../models/DI/types';
import UpdatePrayerLocator from 'src/use-cases/UpdatePryerLocator';

const container: Container = IOC();

const UpdatePrayerRoute = express.Router();

const UpdatePrayerController = async (req: Request, res: Response) => {
  const updatePryerModel = container.get<UpdatePrayerLocator>(TYPES.UpdatePryer);

  const validatedData = updatePryerModel.validate(req.body);

  if (validatedData.error) {
    res.status(422).send({
      code: 'InvalidReceivedData',
      error: validatedData.error.message,
    });
  }

  const updatedPryer = await updatePryerModel.updatePrayer(validatedData);
  res.send(updatedPryer);
};

UpdatePrayerRoute.post('/update-prayer', UpdatePrayerController);
export default UpdatePrayerRoute;
