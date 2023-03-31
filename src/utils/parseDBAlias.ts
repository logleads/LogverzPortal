import { DataBaseSettings } from '~/types/DB-smm-type';

export const parseDBAlias = (value: string): Array<string> => {
  return value
    .split('[[DBDELIM]]')
    .map((item: any) => item.split(',').map((child: any) => child.split('=')))
    .map((item: any) => item[0][1])
    .filter((item: any) => item);
};
export const parseDBEngine = (value: string): any => {
  const resp = value
    .split('[[DBDELIM]]')
    .map((item: any) => item.split(',').map((child: any) => child.split('=')))
    .map((item: any) => {
      if (item && item[3]) return { name: item[0][1], value: item[3][1] };
    })
    .filter((item: any) => item);
  // eslint-disable-next-line no-console
  // console.log('RESPPP', resp);
  return resp;
};

export const parseAllDB = (value: string): DataBaseSettings[] => {
  const test = value.split(',[[DBDELIM]]').filter((item: string) => item);
  const array = test.map((item: string) => item.split(','));
  const objArr = array.map((it: string[]) =>
    it.reduce((acc: Record<string, string>, item: string) => {
      const obj = item.split('=');
      return {
        ...acc,
        [obj[0]]: obj[1],
      };
    }, {}),
  );
  return objArr;
};

export const parseLogverzDBEndpointName = (value: DataBaseSettings): string => {
  return value.LogverzDBEndpointName?.split('.')[0] ?? '';
};
