import { ACCOUNT_NUMBER, REGION, STAGE_NAME } from '~/constants';
import { BaseRequest } from '~/services/api/base-request';

export class EventsWindowService {
  static resource = `arn:aws:dynamodb:${REGION}:${ACCOUNT_NUMBER}:table/Logverz-Invocations`;

  static async getEventsAction(AttributeName: string, AttributeValue: string): Promise<unknown[]> {
    try {
      const { data } = await BaseRequest.post(`${STAGE_NAME}/NoSql`, undefined, {
        params: {
          Resource: EventsWindowService.resource,
          Parameters: [
            {
              AttributeName,
              AttributeValue,
              Expression: '=',
            },
          ],
          Operation: 'dynamodb:Query',
        },
      });

      return data;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  static async getEventsActionUsedLimit(
    AttributeName: string,
    AttributeValue: string,
    limit: number,
  ): Promise<unknown[]> {
    try {
      const { data } = await BaseRequest.post(`${STAGE_NAME}/NoSql`, undefined, {
        params: {
          Resource: EventsWindowService.resource,
          Parameters: [
            {
              AttributeName,
              AttributeValue,
              Expression: '=',
            },
            {
              FilterExpression: {
                Expression: 'desc',
                AttributeName: 'UnixTime',
                Limit: limit,
                Type: 'PostQuery',
              },
            },
          ],
          Operation: 'dynamodb:Query',
        },
      });

      return data;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  static async getEventsActionWithTime(
    AttributeName: string,
    AttributeValue: string,
    unixTime: number,
  ): Promise<unknown[]> {
    const { data } = await BaseRequest.post(`${STAGE_NAME}/NoSql`, undefined, {
      params: {
        Resource: EventsWindowService.resource,
        Parameters: [
          {
            AttributeName,
            AttributeValue,
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
        ],
        Operation: 'dynamodb:Query',
      },
    });

    return data;
  }
}
