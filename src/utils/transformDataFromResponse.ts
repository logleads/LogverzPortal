import { parseObj } from './destructObject';
import { parseFormatTimeUTS } from './parsTimeUTC';

export function transformDataFromResponse(data: Array<unknown>): Array<unknown> {
  return data?.map(i => {
    const obj = parseObj(i);
    return {
      ...obj,
      UnixTimeNormalFormat: parseFormatTimeUTS(obj.UnixTime).utcTime,
      TimeLocalFormat: parseFormatTimeUTS(obj.UnixTime).localTime,
      tm: new Date(obj.UnixTime),
    };
  });
}
