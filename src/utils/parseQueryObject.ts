/* eslint-disable no-console */
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

const parseRule = (
  item: QueryBuilderGroup & QueryBuilderRule,
  index: number,
  logicalOperator: string | undefined,
  query: string,
  ifThereGroupBefore: boolean,
) => {
  let moderatedQuery = query;
  if (getOperator(item.query.operator, item.query.value)) {
    let operator = '';
    if (index !== 0 && !ifThereGroupBefore) {
      operator = ' ' + logicalOperator;
    }

    moderatedQuery =
      moderatedQuery +
      operator +
      ' s.' +
      item.query.rule +
      getOperator(item.query.operator, item.query.value);
  }
  return moderatedQuery;
};

const getOperator = (operator: string, value: string | null): string | boolean => {
  switch (operator) {
    case 'equals':
      return !value ? false : ` = '${value}'`;
    case 'does not equal':
      return !value ? false : ` != '${value}'`;
    case 'contains':
      return !value ? false : ` CONTAINS '${value}'`;
    case 'does not contain':
      return !value ? false : ` NOT CONTAINS '${value}'`;
    case 'is empty':
      return ` IS NULL`;
    case 'is not empty':
      return ` IS NOT NULL`;
    case 'like':
      return !value ? false : ` LIKE '%${value}%'`;
    case 'not like':
      return !value ? false : ` NOT LIKE '%${value}%'`;
    case 'smaller':
      return !value ? false : ` < '${value}'`;
    case 'bigger':
      return !value ? false : ` > '${value}'`;
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
): string => {
  const selectedField = field;
  // console.log('children Index', index);
  if (format === 'CSV' && header === 'NONE') {
    return `s._${index} ${getOperator(role, value)}`;
  }
  return `s.${selectedField} ${getOperator(role, value)}`;
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
  if (format === 'JSON') {
    // console.log('json HEADER INFO', csvHeader);
    additionalQuery = parseChildren(
      obj.children,
      obj.logicalOperator,
      additionalQuery,
      format,
      csvHeader,
    );
    query = `SELECT ${elements} FROM S3Object[*].${rootJSON}[*] s ${additionalQuery}`;
  }
  if (format === 'CSV') {
    // console.log('obj', obj);
    // console.log('CSV HEADER INFO', csvHeader);
    additionalQuery = parseChildren(
      obj.children,
      obj.logicalOperator,
      additionalQuery,
      format,
      csvHeader,
    );
    // console.log(additionalQuery, 'additionalQuery');
    query = `SELECT ${elements} FROM s3object s ${additionalQuery}`;
  }
  // // eslint-disable-next-line no-console
  // console.log(query, 'parseQueryObject');
  return query;
};
