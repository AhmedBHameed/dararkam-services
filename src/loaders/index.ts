import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import {Container} from 'inversify';
import helmet from 'helmet';
import environment from '../config/environment';
import TYPES from '../models/DI/types';
import IOC from './inversionOfControl';
import MongoConnectionLocator from '../services/MongoConnectionLocator';
import {Logger} from '../services/Logger';
// eslint-disable-next-line
import mongoSanitize from 'express-mongo-sanitize';
// eslint-disable-next-line
import sanitizer from 'sanitizer';
import showIp from '../util/showIp';
import {xssProtection} from '../util/xssProtection';
import NextFridayInfoRoute from '../api/NextFridayInfoRoute';
import CreatePrayerRoute from '../api/CreatePrayerRoute';

/**
 * Connection ready state
 * 0 = disconnected
 * 1 = connected
 * 2 = connecting
 * 3 = disconnecting
 * Each state change emits its associated event name.
 */
export default async (): Promise<void> => {
  const {port, root} = environment;
  const container: Container = IOC();

  const log = container.get<Logger>(TYPES.Logger);
  // Handle unhandledRejection.
  process.on('unhandledRejection', reason => {
    log.error(`${reason}`, () => {
      throw reason;
    });
  });

  const mongoConnection = container.get<MongoConnectionLocator>(TYPES.MongoConnectionLocator);
  const readyState = await mongoConnection.connect();

  if (readyState !== 1) {
    throw new Error('🔥 Loaders are not ready! please check log file');
  }

  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(helmet());
  app.use(xssProtection(sanitizer));
  app.use(mongoSanitize());

  app.use(`${root}/api`, NextFridayInfoRoute);
  app.use(`${root}/api`, CreatePrayerRoute);

  app.listen(port, () => {
    console.log(
      `\n\t####################################################################\n\t🛡️  Authentication server listening on port: http://${showIp()}:${port} 🛡️\n\t####################################################################\n`
    );
  });
};
