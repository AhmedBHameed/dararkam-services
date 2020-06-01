import {Moment, RelativeTimeKey} from 'moment';
// eslint-disable-next-line
const momentLib = require('moment');

const moment = (date: string | Date | undefined = undefined, format: RelativeTimeKey | undefined = undefined): Moment =>
  momentLib(date, format);

const getNextFridayDate = () => {
  let thisFriday = moment().day(5);
  const currentDate = moment();

  // If time exceed 2 pm then take next date.
  if (!currentDate.isSameOrBefore(thisFriday.day(5).hour(14))) {
    thisFriday = thisFriday.add(1, 'week');
  }

  return thisFriday;
};

const utcTime = () => (momentLib(new Date()) as Moment).utc();

export {getNextFridayDate, utcTime};
