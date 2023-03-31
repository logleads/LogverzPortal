import { DataBaseTypes } from '~/types/data-base-type';

interface PostgreSQLQueryByCustomInterface {
  logicalOperator: string;
  children: any;
  batchStart: string;
  batchSize: string;
  DBtype: DataBaseTypes;
}

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
  DBtype: DataBaseTypes,
  typeField: string,
): string => {
  if (typeField.includes('JSON')) {
    const selectedField =
      DBtype === DataBaseTypes.PostgreSQL
        ? `\\"${field}\\"::text`
        : `CONVERT(${field} using 'utf8')`;
    return `${selectedField} ${getOperator(role, value)}`;
  } else {
    const selectedField = DBtype === DataBaseTypes.PostgreSQL ? `\\"${field}\\"` : field;
    return `${selectedField} ${getOperator(role, value)}`;
  }
};

export function parsePostgreSQLQueryByCustomFileterWithLimit({
  logicalOperator,
  children,
  batchStart = '0',
  batchSize = '500',
  DBtype = DataBaseTypes.PostgreSQL,
}: PostgreSQLQueryByCustomInterface): string {
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
          DBtype,
          item.typeField,
        );
      });

    if (!queryArray.length) return '';
    let newQuery = '';
    if (DBtype === DataBaseTypes.PostgreSQL) {
      newQuery = `WHERE ${queryArray.join(
        ` ${logicalOperator} `,
      )} LIMIT ${batchSize} OFFSET ${batchStart}`;
    } else if (DBtype === DataBaseTypes.MSSQL) {
      newQuery = `WHERE ${queryArray.join(
        ` ${logicalOperator} `,
      )} AND id BETWEEN ${batchStart} AND ${batchSize}`;
    } else {
      newQuery = `WHERE ${queryArray.join(
        ` ${logicalOperator} `,
      )} LIMIT ${batchSize} OFFSET ${batchStart}`;
    }
    return newQuery;
  }

  return '';
}
