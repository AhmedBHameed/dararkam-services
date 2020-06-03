import {Container} from 'inversify';

import TYPES from '../models/DI/types';
import logger, {Logger} from '../services/Logger';
import MongoConnectionLocator from '../services/MongoConnectionLocator';
import CreatePrayerLocator from '../use-cases/CreatePrayerLocator';
import DeletePrayerLocator from '../use-cases/DeletePrayerLocator';
import GetPrayerLocator from '../use-cases/GetPrayerLocator';
import GetSettingLocator from '../use-cases/GetSettingLocator';
import UpdatePrayerLocator from '../use-cases/UpdatePryerLocator';
import UpdateSettingLocator from '../use-cases/UpdateSettingLocator';

export default (): Container => {
  const container = new Container();
  container.bind<Logger>(TYPES.Logger).toConstantValue(logger);
  container.bind<CreatePrayerLocator>(TYPES.CreatePrayer).to(CreatePrayerLocator).inSingletonScope();
  container.bind<GetSettingLocator>(TYPES.GetSetting).to(GetSettingLocator).inSingletonScope();
  container.bind<GetPrayerLocator>(TYPES.GetPrayer).to(GetPrayerLocator).inSingletonScope();
  container.bind<UpdatePrayerLocator>(TYPES.UpdatePryer).to(UpdatePrayerLocator).inSingletonScope();
  container.bind<UpdateSettingLocator>(TYPES.UpdateSetting).to(UpdateSettingLocator).inSingletonScope();
  container.bind<DeletePrayerLocator>(TYPES.DeletePrayer).to(DeletePrayerLocator).inSingletonScope();
  container.bind<MongoConnectionLocator>(TYPES.MongoConnectionLocator).to(MongoConnectionLocator).inSingletonScope();
  return container;
};
