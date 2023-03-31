/* eslint-disable no-console */
import { ACCOUNT_NUMBER, REGION, STAGE_NAME } from '~/constants';
import { BaseRequest } from '~/services/api/base-request';
import {
  groupResponse,
  payloadForUpdate,
  PermissionsTypes,
  policiesResponse,
  userResponse,
} from '~/types/models/admin-window-types';

export class AdminWindowService {
  static resource = `arn:aws:dynamodb:${REGION}:${ACCOUNT_NUMBER}:table/Logverz-Identities`;

  static async getUsers(): Promise<userResponse[]> {
    const { data } = await BaseRequest.post(`${STAGE_NAME}/NoSql`, undefined, {
      params: {
        Resource: AdminWindowService.resource,
        Parameters: [
          {
            AttributeName: 'IAM',
            AttributeValue: 'true',
            Expression: '=',
          },
        ],
        Operation: 'dynamodb:Query',
      },
    });

    return data as userResponse[];
  }

  static async createUser(payload: {
    Name: string;
    Type: string;
    IAMGroups: string[];
    IAMPolicies: string[];
  }): Promise<any> {
    const { data } = await BaseRequest.post(`${STAGE_NAME}/NoSql`, undefined, {
      params: {
        Resource: AdminWindowService.resource,
        Parameters: [
          {
            AttributeName: 'Name',
            AttributeValue: payload.Name,
            Expression: '=',
          },
          {
            AttributeName: 'Type',
            AttributeValue: payload.Type,
            Expression: '=',
          },
          {
            Payload: {
              IAM: 'true',
              IAMGroups: payload.IAMGroups,
              IAMPolicies: payload.IAMPolicies,
              Name: payload.Name,
              Type: payload.Type,
            },
          },
        ],
        Operation: 'dynamodb:PutItem',
      },
    });
    return data as userResponse[];
  }

  static async updateUser(payload: payloadForUpdate): Promise<any> {
    const { data } = await BaseRequest.post(`${STAGE_NAME}/NoSql`, undefined, {
      params: {
        Resource: AdminWindowService.resource,
        Parameters: [
          {
            AttributeName: 'Name',
            AttributeValue: payload.Name,
            Expression: '=',
          },
          {
            AttributeName: 'Type',
            AttributeValue: payload.type,
            Expression: '=',
          },
          {
            Payload: {
              IAM: 'true',
              IAMGroups: payload.IAMGroups,
              IAMPolicies: payload.IAMPolicies,
              Name: payload.Name,
              Type: payload.type,
            },
          },
        ],
        Operation: 'dynamodb:PutItem',
      },
    });
    return data as userResponse[];
  }

  static async deleteUser(payload: { Name: string; Type: string }): Promise<any> {
    const { data } = await BaseRequest.post(`${STAGE_NAME}/NoSql`, undefined, {
      params: {
        Resource: AdminWindowService.resource,
        Parameters: [
          {
            AttributeName: 'Name',
            AttributeValue: payload.Name,
            Expression: '=',
          },
          {
            AttributeName: 'Type',
            AttributeValue: payload.Type,
            Expression: '=',
          },
        ],
        Operation: 'dynamodb:DeleteItem',
      },
    });
    return data as userResponse[];
  }

  static async checkIfAdmin(): Promise<PermissionsTypes> {
    const { data } = await BaseRequest.get(`${STAGE_NAME}/Info`, undefined, {
      params: {
        service: 'iam',
        apicall: 'GetGroup',
        username: 'self',
      },
    });

    return data as PermissionsTypes;
  }

  static async getPolicies(): Promise<policiesResponse[]> {
    const { data } = await BaseRequest.post(`${STAGE_NAME}/NoSql`, undefined, {
      params: {
        Resource: AdminWindowService.resource,
        Parameters: [
          {
            AttributeName: 'Type',
            AttributeValue: 'PolicyAWS',
            Expression: '=',
          },
        ],
        Operation: 'dynamodb:Query',
      },
    });

    return data as policiesResponse[];
  }

  static async getGroups(): Promise<groupResponse[]> {
    const { data } = await BaseRequest.post(`${STAGE_NAME}/NoSql`, undefined, {
      params: {
        Resource: AdminWindowService.resource,
        Parameters: [
          {
            AttributeName: 'Type',
            AttributeValue: 'GroupAWS',
            Expression: '=',
          },
        ],
        Operation: 'dynamodb:Query',
      },
    });

    return data as groupResponse[];
  }

  static startIdentitySync(): Promise<any> {
    return BaseRequest.post(`${STAGE_NAME}/Start/IdentitySync`);
  }

  static async getUsersAvailableType(): Promise<any> {
    const { data } = await BaseRequest.get(`${STAGE_NAME}/Info`, undefined, {
      params: {
        service: 'cognito-idp',
        apicall: 'ListIdentityProviders',
      },
    });
    return data as string[];
  }

  static async getUserOfGroup(
    groupName: string,
  ): Promise<{ data: userResponse; groupName: string }> {
    const { data } = await BaseRequest.post(`${STAGE_NAME}/NoSql`, undefined, {
      params: {
        Resource: AdminWindowService.resource,
        Parameters: [
          {
            AttributeName: 'IAM',
            AttributeValue: 'true',
            Expression: '=',
          },
          {
            FilterExpression: {
              Expression: 'contains',
              AttributeName: 'IAMGroups',
              AttributeValue: groupName,
            },
          },
        ],
        Operation: 'dynamodb:Query',
      },
    });

    return { data, groupName } as { data: userResponse; groupName: string };
  }

  static async getUserOfPolicy(
    policyName: string,
  ): Promise<{ data: userResponse; policyName: string }> {
    const { data } = await BaseRequest.post(`${STAGE_NAME}/NoSql`, undefined, {
      params: {
        Resource: AdminWindowService.resource,
        Parameters: [
          {
            AttributeName: 'IAM',
            AttributeValue: 'true',
            Expression: '=',
          },
          {
            FilterExpression: {
              Expression: 'contains',
              AttributeName: 'IAMPolicies',
              AttributeValue: policyName,
            },
          },
        ],
        Operation: 'dynamodb:Query',
      },
    });

    return { data, policyName } as { data: userResponse; policyName: string };
  }

  static async getLastSyncTime(): Promise<Date> {
    try {
      const { data } = await BaseRequest.post(`${STAGE_NAME}/NoSql`, undefined, {
        params: {
          Resource: `arn:aws:dynamodb:${REGION}:${ACCOUNT_NUMBER}:table/Logverz-Invocations`,
          Parameters: [
            {
              AttributeName: 'Action',
              AttributeValue: 'IdentitySync',
              Expression: '=',
            },
            {
              FilterExpression: {
                Expression: 'desc',
                AttributeName: 'UnixTime',
                Limit: '1',
                Type: 'PostQuery',
              },
            },
          ],
          Operation: 'dynamodb:Query',
        },
      });

      return data[0].UnixTime;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
