const TYPES = {
  Logger: Symbol.for('Logger'),
  CreatePrayer: Symbol.for('CreatePrayer'),
  GetPrayer: Symbol.for('GetPrayer'),
  GetSetting: Symbol.for('GetSetting'),
  UpdatePryer: Symbol.for('UpdatePryer'),
  UpdateSetting: Symbol.for('UpdateSetting'),
  MongoConnectionLocator: Symbol.for('MongoConnectionLocator'),
};

export default TYPES;
