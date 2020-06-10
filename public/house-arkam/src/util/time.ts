import {Moment, RelativeTimeKey} from 'moment';

// eslint-disable-next-line
const momentLib = require('moment');

const moment = (date: string | Date | undefined = undefined, format: RelativeTimeKey | undefined = undefined): Moment =>
  momentLib(date, format);

const lastFridayDate = (date: string) => {
  return moment(date).subtract(1, 'week').format('YYYY-MM-DD');
};

export {moment, lastFridayDate};
