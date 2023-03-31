/* eslint-disable no-console */
import { ACCOUNT_NUMBER, REGION, STAGE_NAME } from '~/constants';
import { BaseRequest } from '~/services/api/base-request';
import { AdminModule } from '~/store/modules/admin';
import { DataI } from '~/store/modules/save-setting';

export class SaveSettingService {
  static async setSetting(QuerySettings: DataI, name: string): Promise<void> {
    const Parameters: any = [
      {
        AttributeName: 'UsersQuery',
        AttributeValue: AdminModule.permissions.UserName,
        Expression: '=',
      },
      {
        AttributeName: 'UnixTime',
        AttributeValue: Date.now(),
        Expression: '=',
      },
      {
        Payload: {
          DatabaseName: QuerySettings.DataBaseName,
          DataType: QuerySettings.DataType,
          QueryName: name,
          Access: [],
          Owners: [],
          TableName: QuerySettings.TableName,
          QuerySettings,
          UnixTime: Date.now(),
          UsersQuery: AdminModule.permissions.UserName,
          QueryType: 'A',
          Active: true,
          Archive: false,
        },
      },
    ];
    const parameterEncode = encodeURI(JSON.stringify(Parameters));

    await BaseRequest.post(
      `${STAGE_NAME}/NoSql?Resource=arn:aws:dynamodb:${REGION}:${ACCOUNT_NUMBER}:table/Logverz-Queries&Operation=dynamodb:PutItem&Parameters=${parameterEncode}`,
    );
  }
  static async setPermissionSetting(data: {
    unixTime: number;
    UsersQuery: string;
    Owners: Array<{ name: string }>;
    Access: Array<{ name: string }>;
  }): Promise<void> {
    const Parameters: any = [
      {
        AttributeName: 'UsersQuery',
        AttributeValue: data.UsersQuery,
        Expression: '=',
      },
      {
        AttributeName: 'UnixTime',
        AttributeValue: data.unixTime,
        Expression: '=',
      },
      {
        Payload: {
          Access: data.Access,
          Owners: data.Owners,
        },
      },
    ];
    const parameterEncode = encodeURI(JSON.stringify(Parameters));

    await BaseRequest.post(
      `${STAGE_NAME}/NoSql?Resource=arn:aws:dynamodb:${REGION}:${ACCOUNT_NUMBER}:table/Logverz-Queries&Operation=dynamodb:PutItem&Parameters=${parameterEncode}`,
    );
  }
  static async deleteDataRecord(data: {
    unixTime: number;
    UsersQuery: string;
    Archived: boolean;
  }): Promise<void> {
    const Parameters: any = [
      {
        AttributeName: 'UsersQuery',
        AttributeValue: data.UsersQuery,
        Expression: '=',
      },
      {
        AttributeName: 'UnixTime',
        AttributeValue: data.unixTime,
        Expression: '=',
      },
      {
        Payload: {
          Archive: data.Archived,
        },
      },
    ];
    const parameterEncode = encodeURI(JSON.stringify(Parameters));

    await BaseRequest.post(
      `${STAGE_NAME}/NoSql?Resource=arn:aws:dynamodb:${REGION}:${ACCOUNT_NUMBER}:table/Logverz-Queries&Operation=dynamodb:PutItem&Parameters=${parameterEncode}`,
    );
  }
}
