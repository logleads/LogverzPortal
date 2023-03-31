import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

export function parseFormatTimeUTS(utcValue: any): { utcTime: string; localTime: string } {
  const d = new Date(utcValue);
  return {
    utcTime: `${d.getUTCDate()}/${
      d.getUTCMonth() + 1
    }/${d.getUTCFullYear()} ${d.getUTCHours()}:${d.getUTCMinutes()}:${d.getUTCSeconds()}`,
    localTime: `${d.getDate()}/${
      d.getMonth() + 1
    }/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`,
  };
}

export function calcTimeRangeFromNowToNeedsTimeUTC(value: number, period: any): number {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const date = dayjs();
  return date
    .add(value * -1, period)
    .utc()
    .valueOf();
}
