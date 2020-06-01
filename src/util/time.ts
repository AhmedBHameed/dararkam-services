import {Moment, RelativeTimeKey} from 'moment';
// eslint-disable-next-line
const momentLib = require('moment');

const moment = (date: string | Date | undefined = undefined, format: RelativeTimeKey | undefined = undefined): Moment =>
  momentLib(date, format);

const getNextFridayDate = () => {
  return moment().day(5).format('YYYY-MM-DD');
};

const utcTime = () => (momentLib(new Date()) as Moment).utc();

export {getNextFridayDate, utcTime};
