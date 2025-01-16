import { AxiosPromise } from 'axios';

import { ACCOUNT_NUMBER, REGION, STAGE_NAME } from '~/constants';
import { BaseRequest } from '~/services/api/base-request';
import { InfoSmmListResponseItem } from '~/types/common';
import {
  BucketType,
  getTablesItemsType,
  JobConfigResponseType,
  JobConfigType,
  SettingType,
} from '~/types/models/data-collection-types';
import {
  DescribeParametersType,
  ParameterList,
  ParametersType,
} from '~/types/models/query-builder-types';

export class DataCollectionService {
  static resource = `arn:aws:dynamodb:${REGION}:${ACCOUNT_NUMBER}:table/Logverz-Queries`;

  static startJob(body: JobConfigType): AxiosPromise<JobConfigResponseType> {
    return BaseRequest.post(`${STAGE_NAME}/Start/Job`, body);
  }

  static getDatasetAccessItems(isUser: boolean): AxiosPromise<Array<getTablesItemsType>> {
    const params = [
      {
        AttributeName: isUser ? 'IAM' : 'Type',
        AttributeValue: isUser ? 'true' : 'GroupAWS',
        Expression: '=',
      },
    ];
    const Parameters = encodeURI(JSON.stringify(params));

    return BaseRequest.post(
      `${STAGE_NAME}/NoSql?Resource=arn:aws:dynamodb:${REGION}:${ACCOUNT_NUMBER}:table/Logverz-Identities&Operation=dynamodb:Query&Parameters=${Parameters}`,
    );
  }

  static getDatatypeSelector(): AxiosPromise<Array<InfoSmmListResponseItem>> {
    const Parameters: DescribeParametersType = {
      // TODO 1
      ParameterFilters: [
        { Key: 'Name', Option: 'BeginsWith', Values: ['/Logverz/Engine/Schemas/'] },
      ],
    };

    return BaseRequest.get(`${STAGE_NAME}/Info`, {
      service: 'ssm',
      apicall: 'DescribeParameters',
      Parameters,
    });
  }

  static getBuckets(): AxiosPromise<Array<BucketType>> {
    ///////
    return BaseRequest.get(`${STAGE_NAME}/Info?service=s3&apicall=ListAllMyBuckets`);
  }

  static getTypeOfTable(): AxiosPromise<ParameterList> {
    const Parameters: ParametersType = {
      Name: '/Logverz/Engine/S3Select/Parameters',
      WithDecryption: true,
    };
    const parameterEncode = encodeURI(JSON.stringify(Parameters));
    return BaseRequest.get(
      `${STAGE_NAME}/Info?service=ssm&apicall=GetParameter&Parameters=${parameterEncode}`,
    );
  }

  static getTableKeys(schema: string): AxiosPromise<ParameterList> {
    const Parameters: ParametersType = {
      Name: `/Logverz/Engine/Schemas/${schema}`,
      WithDecryption: true,
    };
    const parameterEncode = encodeURI(JSON.stringify(Parameters));
    return BaseRequest.get(
      `${STAGE_NAME}/Info?service=ssm&apicall=GetParameter&Parameters=${parameterEncode}`,
    );
  }

  static getPath(path: string): AxiosPromise<unknown> {
    const params = encodeURI(JSON.stringify({ S3EnumerationDepth: 3, Path: path + '/' }));
    return BaseRequest.get(`${STAGE_NAME}/Info?service=s3&apicall=ListBucket&Parameters=${params}`);
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

  static async getSettings(
    user: string,
    typeQuery: boolean = false,
    unixTime: number,
  ): Promise<SettingType[]> {
    const Parameters = typeQuery
      ? [
          {
            Expression: '=',
            AttributeName: 'QueryType',
            AttributeValue: 'C',
          },
          {
            AttributeName: 'UnixTime',
            AttributeValue: unixTime,
            Expression: '>',
          },
          {
            KeyConditionExpression: 'and',
          },
          {
            FilterExpression: {
              AttributeName: 'UsersQuery',
              AttributeValue: user,
              Expression: '<>',
            },
          },
          {
            FilterExpression: {
              Expression: 'contains',
              AttributeName: 'sharedquery',
              AttributeValue: 'self',
              Type: 'PostQuery',
            },
          },
        ]
      : [
          {
            AttributeName: 'UsersQuery',
            AttributeValue: user,
            Expression: '=',
          },
          {
            AttributeName: 'UnixTime',
            AttributeValue: unixTime,
            Expression: '>',
          },
          {
            KeyConditionExpression: 'and',
          },
          {
            FilterExpression: {
              Expression: '=',
              AttributeName: 'QueryType',
              AttributeValue: 'C',
            },
          },
        ];
    const { data } = await BaseRequest.post(`${STAGE_NAME}/NoSql`, undefined, {
      params: {
        Resource: DataCollectionService.resource,
        Parameters,
        Operation: 'dynamodb:Query',
      },
    });

    return data as SettingType[];
  }

  static async getSettingsSortByTime(
    user: string,
    unixTime: number,
    typeQuery: boolean = false,
  ): Promise<SettingType[]> {
    const Parameters = typeQuery
      ? [
          {
            Expression: '=',
            AttributeName: 'QueryType',
            AttributeValue: 'C',
          },
          {
            AttributeName: 'UnixTime',
            AttributeValue: unixTime,
            Expression: '>',
          },
          {
            KeyConditionExpression: 'and',
          },
          {
            FilterExpression: {
              AttributeName: 'UsersQuery',
              AttributeValue: user,
              Expression: '<>',
            },
          },
          {
            FilterExpression: {
              Expression: 'contains',
              AttributeName: 'sharedquery',
              AttributeValue: 'self',
              Type: 'PostQuery',
            },
          },
        ]
      : [
          {
            AttributeName: 'UsersQuery',
            AttributeValue: user,
            Expression: '=',
          },
          {
            AttributeName: 'UnixTime',
            AttributeValue: unixTime,
            Expression: '>',
          },
          {
            KeyConditionExpression: 'and',
          },
          {
            FilterExpression: {
              Expression: '=',
              AttributeName: 'QueryType',
              AttributeValue: 'C',
            },
          },
        ];
    const { data } = await BaseRequest.post(`${STAGE_NAME}/NoSql`, undefined, {
      params: {
        Resource: DataCollectionService.resource,
        Parameters,
        Operation: 'dynamodb:Query',
      },
    });
    return data as SettingType[];
  }

  static async getListFolders(listNameFolder: string[]): Promise<any[]> {
    const requests = listNameFolder.map((item: any) => {
      const req = { S3EnumerationDepth: 3, Path: `s3://${item}` };
      return BaseRequest.get(
        `${STAGE_NAME}/Info?service=s3&apicall=ListBucket&Parameters=${encodeURI(
          JSON.stringify(req),
        )}`,
      );
    });
    return Promise.allSettled(requests);
  }

  static async getSameData(schemasName: string): Promise<string> {
    try {
      const Parameters: ParametersType = {
        Name: `/Logverz/Engine/Samples/${schemasName}`,
        WithDecryption: false,
      };
      const parameterEncode = encodeURI(JSON.stringify(Parameters));

      const data = await BaseRequest.get(
        `${STAGE_NAME}/Info?service=ssm&apicall=GetParameter&Parameters=${parameterEncode}`,
      );

      return data.data.Parameter.Value;
    } catch (e) {
      return 'Non';
    }
  }
}
