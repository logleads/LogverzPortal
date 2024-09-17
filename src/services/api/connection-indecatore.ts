/* eslint-disable no-console */
import { NOTIFICATION_GLOBAL_NEWS_URL, STAGE_NAME } from '~/constants';
import { BaseRequest } from '~/services/api/base-request';
import { DataBaseSettings } from '~/types/DB-smm-type';
import { AutoscalingGroupsName } from '~/types/models/autoscaling-group-name';
import { parseAllDB } from '~/utils/parseDBAlias';

export class ConnectionIndicator {
  static async getInformation(DBname: string): Promise<{
    DBInstanceStatus: string;
    DBInstanceIdentifier: string;
  }> {
    try {
      const { data } = await BaseRequest.get(
        `${STAGE_NAME}/Info?service=rds&apicall=DescribeDBInstances&Parameters=%7B%22DBInstanceIdentifier%22%3A%22${DBname}%22%7D`,
      );
      return {
        DBInstanceStatus: data.origin.DBInstanceStatus,
        DBInstanceIdentifier: data.origin.DBInstanceIdentifier,
      };
    } catch ({ message }) {
      throw new Error(message as string);
    }
  }

  static async getInformationAboutAuto(
    TurnSrv: string,
    WebRTC: string,
  ): Promise<
    Array<{
      DesiredCapacity: number;
      LaunchTemplateName: string;
      MinSize: number;
      MaxSize: number;
      InstanceId: string;
      status: string;
      Instances: unknown;
    }>
  > {
    try {
      const { data } = await BaseRequest.get(
        `${STAGE_NAME}/Info?service=autoscaling&apicall=DescribeAutoScalingGroups&Parameters=%7B%22AutoScalingGroupNames%22%3A%5B%22${TurnSrv}%22%2C%22${WebRTC}%22%5D%7D`,
      );

      return data.AutoScalingGroups.map((item: any) => {
        return {
          DesiredCapacity: item.DesiredCapacity,
          MinSize: item.MinSize,
          MaxSize: item.MaxSize,
          LaunchTemplateName:
            item.MixedInstancesPolicy.LaunchTemplate.LaunchTemplateSpecification.LaunchTemplateName,
          InstanceId: item.DesiredCapacity ? item.Instances[0].InstanceId : '',
          status: item.DesiredCapacity ? item.Instances[0].HealthStatus : '',
          Instances: item.Instances,
        };
      });
    } catch ({ message }) {
      throw new Error(message as string);
    }
  }

  static async setProperty(DBname: string, state: boolean, cluster: string): Promise<string> {
    try {
      const { data } =
        cluster === null
          ? await BaseRequest.post(
              `${STAGE_NAME}/Start/ToScale?service=rds&apicall=${
                state ? 'StartDBInstance' : 'StopDBInstance'
              }&Parameters=%7B%22DBInstanceIdentifier%22%3A%22${DBname}%22%7D`,
            )
          : await BaseRequest.post(
              `${STAGE_NAME}/Start/ToScale?service=rds&apicall=${
                state ? 'StartDBCluster' : 'StopDBCluster'
              }&Parameters=%7B%22DBClusterIdentifier%22%3A%22${cluster}%22%7D`,
            );
      return data;
    } catch ({ message }) {
      throw new Error(message as string);
    }
  }

  static async setDesiredCapacity(autoScalingGroupName: string, value: number): Promise<string> {
    try {
      console.log(autoScalingGroupName, value, 'setDesiredCapacity');
      const { data } = await BaseRequest.post(
        `${STAGE_NAME}/Start/ToScale?service=autoscaling&apicall=SetDesiredCapacity&Parameters=%7B%22AutoScalingGroupName%22%3A%20%22${autoScalingGroupName}%22%2C%20%22DesiredCapacity%22%3A%20${value}%2C%22HonorCooldown%22%3A%20true%7D`,
      );

      return data;
    } catch ({ message }) {
      throw new Error(message as string);
    }
  }

  static async getAutoscalingGroupsName(): Promise<AutoscalingGroupsName> {
    try {
      const { data } = await BaseRequest.get(
        //todo use encode uri for all above strings, so that the config is stored url decoded.
        `${STAGE_NAME}/Info?service=ssm&apicall=GetParameter&Parameters=%7B%22Name%22%3A%20%22%2FLogverz%2FEngine%2FAutoScalingGroupList%22%2C%22WithDecryption%22%3A%20false%7D`,
      );
      return JSON.parse(data.Parameter.Value);
    } catch ({ message }) {
      throw new Error(message as string);
    }
  }

  static async getDataBaseRegistry(): Promise<DataBaseSettings[]> {
    try {
      const { data } = await BaseRequest.get(
        //todo use encode uri for all above strings, so that the config is stored url decoded.
        `${STAGE_NAME}/Info?service=ssm&apicall=GetParameter&Parameters=%7B%22Name%22%3A%20%22%2FLogverz%2FDatabase%2FRegistry%22%2C%22WithDecryption%22%3A%20false%7D`,
      );
      return parseAllDB(data.Parameter.Value.replaceAll('\n',''));
    } catch ({ message }) {
      throw new Error(message as string);
    }
  }

  static async getGlobalNotifications(): Promise<any> {
    try {
      const response = await fetch(NOTIFICATION_GLOBAL_NEWS_URL);
      const notifications = await response.json();
      return notifications;
    } catch ({ message }) {
      throw new Error(message as string);
    }
  }
}
