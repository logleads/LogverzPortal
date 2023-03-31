import { AxiosPromise } from 'axios';

import { ACCOUNT_NUMBER, REGION, STAGE_NAME } from '~/constants';
import { BaseRequest } from '~/services/api/base-request';
import {
  DataType,
  IdentitiesQueryParameters,
  IdentitiesQueryResponse,
  ParameterList,
  ParametersType,
} from '~/types/models/query-builder-types';

export class QueryBuilderService {
  static getTableParametersList(schema: DataType): AxiosPromise<ParameterList> {
    // eslint-disable-next-line no-console
    // console.log(schema)
    const Parameters: ParametersType = {
      Name: `/Logverz/Engine/Schemas/${schema}`,
      WithDecryption: true,
    };
    const parameterEncode = encodeURI(JSON.stringify(Parameters));
    return BaseRequest.get(
      `${STAGE_NAME}/Info?service=ssm&apicall=GetParameter&Parameters=${parameterEncode}`,
    );
  }

  static getDBAlias(): AxiosPromise<ParameterList> {
    const Parameters: ParametersType = {
      Name: '/Logverz/Database/Registry',
      WithDecryption: false,
    };
    const parameterEncode = encodeURI(JSON.stringify(Parameters));
    return BaseRequest.get(
      `${STAGE_NAME}/Info?service=ssm&apicall=GetParameter&Parameters=${parameterEncode}`,
    );
  }

  static getTableDataType(payload: {
    databaseName: string;
    DatasetName: string;
  }): AxiosPromise<Array<IdentitiesQueryResponse>> {
    const Parameters: Array<IdentitiesQueryParameters | { KeyConditionExpression: string }> = [
      {
        AttributeName: 'DatabaseName',
        AttributeValue: payload.databaseName,
        Expression: '=',
      },
      {
        AttributeName: 'TableName',
        AttributeValue: payload.DatasetName,
        Expression: 'begins_with',
      },
      {
        KeyConditionExpression: 'and',
      },
    ];
    const encodeParameters = encodeURI(JSON.stringify(Parameters));
    return BaseRequest.post(
      `${STAGE_NAME}/NoSql?Resource=arn:aws:dynamodb:${REGION}:${ACCOUNT_NUMBER}:table/Logverz-Queries&Operation=dynamodb:Query&Parameters=${encodeParameters}`,
    );
  }
}
