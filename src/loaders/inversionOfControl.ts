import {Container} from 'inversify';
import TYPES from '../models/DI/types';
import logger, {Logger} from '../services/Logger';
import MongoConnectionLocator from '../services/MongoConnectionLocator';
import GetSettingLocator from '../use-cases/GetSettingLocator';
import UpdateSettingLocator from '../use-cases/UpdateSettingLocator';
import GetPrayerLocator from '../use-cases/GetPrayerLocator';
import CreatePrayerLocator from '../use-cases/CreatePrayerLocator';

export default (): Container => {
  const container = new Container();
  container.bind<Logger>(TYPES.Logger).toConstantValue(logger);
  container.bind<CreatePrayerLocator>(TYPES.CreatePrayer).to(CreatePrayerLocator).inSingletonScope();
  container.bind<GetSettingLocator>(TYPES.GetSetting).to(GetSettingLocator).inSingletonScope();
  container.bind<GetPrayerLocator>(TYPES.GetPrayer).to(GetPrayerLocator).inSingletonScope();
  container.bind<UpdateSettingLocator>(TYPES.UpdateSetting).to(UpdateSettingLocator).inSingletonScope();
  container.bind<MongoConnectionLocator>(TYPES.MongoConnectionLocator).to(MongoConnectionLocator).inSingletonScope();
  return container;
};
