import 'reflect-metadata';

import bodyParser from 'body-parser';
import express from 'express';
// eslint-disable-next-line
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import {Container} from 'inversify';
import path from 'path';
// eslint-disable-next-line
import sanitizer from 'sanitizer';

import CreatePrayerRoute from '../api/CreatePrayerRoute';
import DeletePrayerRoute from '../api/DeletePryerRoute';
import ListAllPrayersRoute from '../api/ListAllPrayers';
import NextFridayInfoRoute from '../api/NextFridayInfoRoute';
import UpdatePrayerRoute from '../api/UpdatePrayerRoute';
import environment from '../config/environment';
import TYPES from '../models/DI/types';
import {Logger} from '../services/Logger';
import MongoConnectionLocator from '../services/MongoConnectionLocator';
import {allowOriginAccess} from '../util/allow-origin-access';
import showIp from '../util/showIp';
import {xssProtection} from '../util/xssProtection';
import IOC from './inversionOfControl';

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
  console.log('environment', environment);
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

  app.use(allowOriginAccess());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(helmet());
  app.use(xssProtection(sanitizer));
  app.use(mongoSanitize());

  app.use(
    '/prayers-list/01EAG4SCJSN7HXE500X0W0YEKK01EAG4SCJSXH9KTAGRTDEXF06E',
    express.static(path.join('public/house-arkam/build'))
  );
  app.use(`${root}/api`, ListAllPrayersRoute);
  app.use(`${root}/api`, NextFridayInfoRoute);
  app.use(`${root}/api`, CreatePrayerRoute);
  app.use(`${root}/api`, UpdatePrayerRoute);
  app.use(`${root}/api`, DeletePrayerRoute);

  app.listen(port, () => {
    console.log(
      `\n\t#################################################################################\n\t🛡️  Application server listening on port: http://[${showIp()}]:${port} 🛡️\n\t#################################################################################\n`
    );
  });
};
