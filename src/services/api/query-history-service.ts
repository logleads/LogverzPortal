import { ACCOUNT_NUMBER, REGION, STAGE_NAME } from '~/constants';
import { BaseRequest } from '~/services/api/base-request';
import { SettingType } from '~/types/models/data-collection-types';

export class QueryHistoryService {
  static resource = `arn:aws:dynamodb:${REGION}:${ACCOUNT_NUMBER}:table/Logverz-Queries`;

  static async getSettingsQH(user: string, typeQuery: boolean = false): Promise<SettingType[]> {
    const Parameters = !typeQuery
      ? [
          {
            AttributeName: 'UsersQuery',
            AttributeValue: user,
            Expression: '=',
          },
          {
            FilterExpression: {
              Expression: '=',
              AttributeName: 'QueryType',
              AttributeValue: 'C',
            },
          },
        ]
      : [
          {
            AttributeName: 'QueryType',
            AttributeValue: 'C',
            Expression: '=',
          },
          {
            FilterExpression: {
              Expression: '<>',
              AttributeName: 'UsersQuery',
              AttributeValue: user,
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
        ];
    const { data } = await BaseRequest.post(`${STAGE_NAME}/NoSql`, undefined, {
      params: {
        Resource: QueryHistoryService.resource,
        Parameters,
        Operation: 'dynamodb:Query',
      },
    });
    return data as SettingType[];
  }

  static async getAnaliticsQH(user: string, typeQuery: boolean = false): Promise<SettingType[]> {
    const Parameters = !typeQuery
      ? [
          {
            AttributeName: 'UsersQuery',
            AttributeValue: user,
            Expression: '=',
          },
          {
            FilterExpression: {
              Expression: '=',
              AttributeName: 'QueryType',
              AttributeValue: 'A',
            },
          },
        ]
      : [
          {
            AttributeName: 'QueryType',
            AttributeValue: 'A',
            Expression: '=',
          },
          {
            FilterExpression: {
              Expression: '<>',
              AttributeName: 'UsersQuery',
              AttributeValue: user,
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
        ];
    const { data } = await BaseRequest.post(`${STAGE_NAME}/NoSql`, undefined, {
      params: {
        Resource: QueryHistoryService.resource,
        Parameters,
        Operation: 'dynamodb:Query',
      },
    });

    return data as SettingType[];
  }

  static async sortByTypeQuery(user: string): Promise<void> {
    const { data } = await BaseRequest.post(`${STAGE_NAME}/NoSql`, undefined, {
      params: {
        Resource: 'arn:aws:dynamodb:ap-southeast-2:965017399465:table/Logverz-Queries',
        Parameters: [
          {
            AttributeName: 'QueryType',
            AttributeValue: 'C',
            Expression: '=',
          },
          {
            FilterExpression: {
              Expression: '<>',
              AttributeName: 'UsersQuery',
              AttributeValue: user,
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
        ],
        Operation: 'dynamodb:Query',
      },
    });
  }

  static async getSettingsSortByTime(
    user: string,
    unixTime: number,
    value: string,
    typeQuery: boolean = false,
  ): Promise<SettingType[]> {
    const Parameters = typeQuery
      ? [
          {
            Expression: '=',
            AttributeName: 'QueryType',
            AttributeValue: value,
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
              AttributeValue: value,
            },
          },
        ];

    const { data } = await BaseRequest.post(`${STAGE_NAME}/NoSql`, undefined, {
      params: {
        Resource: QueryHistoryService.resource,
        Parameters,
        Operation: 'dynamodb:Query',
      },
    });
    return data as SettingType[];
  }

  static async getSettings(
    user: string,
    unixTime: number,
    value: string,
    typeQuery: boolean = false,
  ): Promise<SettingType[]> {
    const Parameters = typeQuery
      ? [
          {
            Expression: '=',
            AttributeName: 'QueryType',
            AttributeValue: value,
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
            FilterExpression: {
              Expression: '=',
              AttributeName: 'QueryType',
              AttributeValue: value,
            },
          },
        ];

    const { data } = await BaseRequest.post(`${STAGE_NAME}/NoSql`, undefined, {
      params: {
        Resource: QueryHistoryService.resource,
        Parameters,
        Operation: 'dynamodb:Query',
      },
    });
    return data as SettingType[];
  }
}
