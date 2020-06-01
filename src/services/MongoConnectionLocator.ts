import bluebird from 'bluebird';
import {inject, injectable} from 'inversify';
import {connect, Mongoose, set} from 'mongoose';
import winston from 'winston';

import environment from '../config/environment';
import TYPES from '../models/DI/types';

@injectable()
class MongoConnectionLocator {
  @inject(TYPES.Logger)
  private _logger!: winston.Logger;

  private _init() {
    bluebird.promisifyAll(Mongoose);
    set('useCreateIndex', true);
    set('useNewUrlParser', true);
    set('toObject', {
      virtuals: true,
      versionKey: false,
      transform: (_: any, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    });
    set('toJSON', {
      virtuals: true,
      versionKey: false,
      transform: (_: any, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    });
  }

  public async connect(): Promise<number> {
    this._init();
    try {
      const {dbName, password, port, server, user} = environment.database;
      const connection = await connect(`mongodb://${server}:${port}/${dbName}`, {
        user: user,
        pass: password,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      });
      return connection.connection.readyState;
    } catch (error) {
      this._logger.error('🔥 Database connection failed: %o', error);
      return -1;
    }
  }
}

export default MongoConnectionLocator;
