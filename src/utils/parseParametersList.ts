import { QueryBuilderRule } from '~/types/models/query-builder-types';

export const parseParametersList = (value: string): Array<QueryBuilderRule> => {
  const SchemaArray = JSON.parse(value).Schema;
  const Schema = ('{' + SchemaArray.map((e: any) => e + '\n') + '}')
    .replace(/,'/g, '"')
    .replace(/'/g, '"');
  const arrayFromString = Schema.split(',')
    .map(i => {
      return i
        .split(/\r?\n/)
        .join(' ')
        .replace(/['"]+/g, '')
        .replace(' ', '')
        .replace(/{/g, '')
        .replace(/}/g, '');
    })
    .map(r => {
      const item = r.split(':');

      return item;
    });
  return arrayFromString.map((i: any) => {
    return {
      type: i[2],
      id: i[0],
      label: i.length > 3 ? `${i[0]}:${i[1]}` : i[0],
    };
  });
};
