import { MSSQL_PREFIX } from '~/constants';
import { DataBaseTypes } from '~/types/data-base-type';

export function getSQLQuery(
  dataBaseCurrentAlias: string,
  currentAvailableTable: string,
  dbEngine: string,
): string {
  if (dbEngine === DataBaseTypes.PostgreSQL) {
    return `"SELECT * FROM \\"${currentAvailableTable}\\" LIMIT 500 OFFSET 0"`;
  } else if (dbEngine === DataBaseTypes.MSSQL) {
    return `"SELECT * FROM ${MSSQL_PREFIX}.${currentAvailableTable} WHERE id BETWEEN 0 AND 500"`;
  } else {
    return `SELECT * FROM ${currentAvailableTable} LIMIT 500 OFFSET 0`;
  }
}
