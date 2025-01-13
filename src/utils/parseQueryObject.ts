/* eslint-disable no-console */
import { reservedKeywordsList } from '~/reservedKeywordsList';
import { DataCollectionModule } from '~/store/modules/data-collection';
import { MainQuery, QueryBuilderGroup, QueryBuilderRule } from '~/types/common';

// const getOperator = (operator: string, value: string | null): string | boolean => {
//   switch (operator) {
//     case 'equals':
//       return !value ? false : ` = "${value}"`;
//     case 'does not equal':
//       return !value ? false : ` != "${value}"`;
//     case 'contains':
//       return !value ? false : ` CONTAINS "${value}"`;
//     case 'does not contain':
//       return !value ? false : ` NOT CONTAINS "${value}"`;
//     case 'is empty':
//       return ` IS NULL`;
//     case 'is not empty':
//       return ` IS NOT NULL`;
//     case 'begins with':
//       return !value ? false : ` LIKE "${value}%"`;
//     case 'ends with':
//       return !value ? false : ` LIKE "%${value}"`;
//     default:
//       return false;
//   }
// };

// const parseRule = (
//   item: QueryBuilderGroup & QueryBuilderRule,
//   index: number,
//   logicalOperator: string | undefined,
//   query: string,
//   ifThereGroupBefore: boolean,
// ) => {
//   let moderatedQuery = query;
//   if (getOperator(item.query.operator, item.query.value)) {
//     let operator = '';
//     if (index !== 0 && !ifThereGroupBefore) {
//       operator = ' ' + logicalOperator;
//     }

//     moderatedQuery =
//       moderatedQuery +
//       operator +
//       ' s.' +
//       item.query.rule +
//       getOperator(item.query.operator, item.query.value);
//   }
//   return moderatedQuery;
// };

const convertType = (castType: string | object | null, value: string) => {
  if (castType === 'int') {
    return parseInt(value);
  }
  if (castType === 'float') {
    return parseFloat(value);
  }
  return `'${value}'`;
};

const getOperator = (
  operator: string,
  value: string | null,
  castType: string | object | null,
): string | boolean => {
  switch (operator) {
    case 'equals':
      return !value ? false : ` = ${convertType(castType, value)}`;
    case 'does not equal':
      return !value ? false : ` != ${convertType(castType, value)}`;
    case 'contains':
      return !value ? false : ` CONTAINS ${convertType(castType, value)}`;
    case 'does not contain':
      return !value ? false : ` NOT CONTAINS ${convertType(castType, value)}`;
    case 'is empty':
      return ` IS NULL`;
    case 'is not empty':
      return ` IS NOT NULL`;
    case 'like':
      return !value ? false : ` LIKE '%${value}%'`;
    case 'not like':
      return !value ? false : ` NOT LIKE '%${value}%'`;
    case 'smaller':
      return !value ? false : ` < ${convertType(castType, value)}`;
    case 'bigger':
      return !value ? false : ` > ${convertType(castType, value)}`;
    default:
      return false;
  }
};

const generateOneRawFromWhereQuery = (
  field: string,
  role: string,
  value: string,
  index: string,
  format: string,
  header: string,
  castType: string | object,
): string => {
  const selectedField = field;
  console.log('children Index', typeof castType);
  if (format === 'CSV' && header === 'NONE') {
    if (castType && typeof castType !== 'object') {
      return `CAST(s._${index} as ${castType}) ${getOperator(role, value, castType)}`;
    }
    return `s._${index} ${getOperator(role, value, castType)}`;
  } else if (castType && typeof castType !== 'object') {
    return `CAST(s.${checkForReservedKeyWord(selectedField)} as ${castType}) ${getOperator(
      role,
      value,
      castType,
    )}`;
  }
  return `s.${checkForReservedKeyWord(selectedField)} ${getOperator(role, value, castType)}`;
};

const checkForReservedKeyWord = (selectedField: string) => {
  if (reservedKeywordsList.includes(selectedField)) {
    return `"${selectedField}"`;
  } else {
    return selectedField;
  }
};

const parseChildren = (
  children: Array<QueryBuilderGroup & QueryBuilderRule>,
  logicalOperator: string | undefined,
  query: string,
  format: string,
  header: string,
) => {
  if (children.length) {
    const queryArray = children
      .filter((it: any) => {
        return it.role === 'is empty' || it.role === 'is not empty'
          ? it.field
          : it.role && it.field && it.value;
      })
      .map((item: any) => {
        return generateOneRawFromWhereQuery(
          item.field,
          item.role,
          item.value,
          item.index,
          format,
          header,
          item.castType,
        );
      });

    if (!queryArray.length) return '';
    const newQuery = `WHERE ${queryArray.join(` ${logicalOperator} `)}`;

    return newQuery;
  }
  return '';
};

export const parseQueryObject = (
  obj: MainQuery,
  format: string,
  rootJSON: string = 'Records',
  csvHeader: string,
): string => {
  if (!obj.children.length) {
    return '';
  }
  const elements = '*';
  let additionalQuery = '';
  let query = '';
  additionalQuery = parseChildren(
    obj.children,
    obj.logicalOperator,
    additionalQuery,
    format,
    csvHeader,
  );
  query = `SELECT ${elements} FROM ${DataCollectionModule.DatasetName} ${additionalQuery}`;
  // if (format === 'JSON') {
  //   // console.log('json HEADER INFO', csvHeader);
   
  // }
  // if (format === 'CSV') {
  //   // console.log('obj', obj);
  //   // console.log('CSV HEADER INFO', csvHeader);
  //   additionalQuery = parseChildren(
  //     obj.children,
  //     obj.logicalOperator,
  //     additionalQuery,
  //     format,
  //     csvHeader,
  //   );
  //   // console.log(additionalQuery, 'additionalQuery');
  //   query = `SELECT ${elements} FROM ${DataCollectionModule.DatasetName} ${additionalQuery}`;
  // }
  // // eslint-disable-next-line no-console
  // console.log(query, 'parseQueryObject');
  return query;
};
