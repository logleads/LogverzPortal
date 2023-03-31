/* eslint-disable no-console */
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';

import { ConnectionIndicator as ConnectionIndecatoreService } from '~/services/api/connection-indecatore';
import { store } from '~/store';
import { DataBaseShow } from '~/types/data-base-show';
import { DataBaseSettings } from '~/types/DB-smm-type';
import { AutoscalingGroupsName } from '~/types/models/autoscaling-group-name';
import { parseLogverzDBEndpointName } from '~/utils/parseDBAlias';

import { ErrorsModule } from './errors';

const ms1 = 'stopped';
const ms2 = 'available';

function selectStatuse(vl: string): string {
  if (vl == ms1) {
    return 'gray';
  } else if (vl == ms2) {
    return 'green';
  } else {
    return '#fd6c35';
  }
}

@Module({
  dynamic: true,
  name: 'ConnectionIndecatore',
  store,
})
class ConnectionIndecatore extends VuexModule {
  public DBinstanse: DataBaseShow[] = [];
  public proxy: Array<any> = [];
  public turnServ: Array<any> = [];
  public turnServInstances: any = [];
  public proxyInstances: any = [];
  public autoscalingGroupsName: AutoscalingGroupsName = { TurnServerASG: '', WebRTCProxyASG: '' };
  public dataBaseRegistry: DataBaseSettings[] = [];
  public loader: boolean = false;
  public loaderForIndicator: boolean = false;

  @Mutation
  private SET_LOADER_FOR_INDICATOR(v: boolean) {
    this.loaderForIndicator = v;
  }
  @Mutation
  private SET_LOADER(v: boolean) {
    this.loader = v;
  }

  @Mutation
  private SET_AUTOSCALING_GROUPS_NAME(value: AutoscalingGroupsName) {
    this.autoscalingGroupsName = value;
  }

  @Mutation
  private SET_DATA_BASE_REGISTRY(value: DataBaseSettings[]) {
    this.dataBaseRegistry = value;
  }

  @Mutation
  private SET_PROXY(value: Array<any>) {
    this.proxy = value;
  }

  @Mutation
  private SET_TURN_SERV(value: Array<any>) {
    this.turnServ = value;
  }

  @Mutation
  private SET_PROXY_INSTANCES(value: Array<any>) {
    this.proxyInstances = value;
  }

  @Mutation
  private SET_TURN_SERV_INSTANCES(value: Array<any>) {
    this.turnServInstances = value;
  }

  @Mutation
  private SET_DB_INSTANSE(value: DataBaseShow[]) {
    this.DBinstanse = value;
  }

  @Action
  public setLoader(v: boolean) {
    this.SET_LOADER(v);
  }

  @Action
  public async getRTCStatuse() {
    try {
      const promises = this.dataBaseRegistry.map(DBinfo => {
        return ConnectionIndecatoreService.getInformation(DBinfo.instanceName as string);
      });

      const dt = await Promise.all(promises);

      const dtt = dt.map(it => {
        return {
          ...it,
          status: selectStatuse(it.DBInstanceStatus),
          name:
            this.dataBaseRegistry.filter(
              (item: any) => item.instanceName === it.DBInstanceIdentifier,
            )[0].LogverzDBFriendlyName ?? '',
          cluster:
            this.dataBaseRegistry.filter(
              (item: any) => item.instanceName === it.DBInstanceIdentifier,
            )[0].LogverzDBClusterID ?? null,
        };
      });
      console.log('detail', JSON.stringify(dtt));
      this.SET_DB_INSTANSE([...dtt]);
    } catch ({ message }) {
      console.log(message);
      ErrorsModule.showErrorMessage(message as string);
    }
    this.SET_LOADER(false);
  }

  @Action
  public setLoaderForIndicator(v: boolean) {
    this.SET_LOADER_FOR_INDICATOR(v);
  }

  @Action
  public async getDescribeAutoScalingGroups() {
    try {
      const data = await ConnectionIndecatoreService.getInformationAboutAuto(
        this.autoscalingGroupsName?.TurnServerASG,
        this.autoscalingGroupsName?.WebRTCProxyASG,
      );
      const proxy = data.filter((item: any) => {
        return item.LaunchTemplateName.toLowerCase().includes('proxy');
      });
      const turnServ = data.filter((item: any) => {
        return item.LaunchTemplateName.toLowerCase().includes('turn');
      });
      this.SET_PROXY(proxy);
      const proxyInstance = proxy.map((item: any) => {
        return item.Instances;
      });
      this.SET_PROXY_INSTANCES(proxyInstance[0] as never);
      this.SET_TURN_SERV(turnServ);
      const turnInstances = turnServ.map((item: any) => {
        return item.Instances;
      });
      this.SET_TURN_SERV_INSTANCES(turnInstances[0] as never);
    } catch ({ message }) {
      ErrorsModule.showErrorMessage(message as string);
    }
    this.SET_LOADER(false);
  }

  @Action
  public async setDesiredCapacity(data: { autoScalingGroupName: string; value: number }) {
    this.SET_LOADER(true);

    try {
      const response = await ConnectionIndecatoreService.setDesiredCapacity(
        data.autoScalingGroupName,
        data.value,
      );
      console.log(response, data, 'setDesiredCapacity');
    } catch ({ message }) {
      ErrorsModule.showErrorMessage(message as string);
    }
    this.SET_LOADER(false);
  }

  @Action
  public async setProperty({
    DBname,
    state,
    cluster,
  }: {
    DBname: string;
    state: boolean;
    cluster: string;
  }) {
    this.SET_LOADER(true);

    try {
      await ConnectionIndecatoreService.setProperty(DBname, state, cluster);
    } catch ({ message }) {
      ErrorsModule.showErrorMessage(message as string);
    }
    this.SET_LOADER(false);
  }

  @Action
  public async getAutoscalingGroupsName() {
    this.SET_LOADER(true);

    try {
      const data = await ConnectionIndecatoreService.getAutoscalingGroupsName();
      this.SET_AUTOSCALING_GROUPS_NAME(data);
      this.getDescribeAutoScalingGroups();
    } catch ({ message }) {
      ErrorsModule.showErrorMessage(message as string);
    }
    this.SET_LOADER(false);
  }

  @Action
  public async getDataBaseRegistry() {
    this.SET_LOADER(true);

    try {
      const data = await ConnectionIndecatoreService.getDataBaseRegistry();
      this.SET_DATA_BASE_REGISTRY(
        data.map((item: any) => ({ ...item, instanceName: parseLogverzDBEndpointName(item) })),
      );
      this.getRTCStatuse();
    } catch ({ message }) {
      ErrorsModule.showErrorMessage(message as string);
    }
    this.SET_LOADER(false);
  }

  @Action
  public async getDefaultParameters() {
    try {
      this.getDataBaseRegistry();
      this.getAutoscalingGroupsName();
    } catch ({ message }) {
      ErrorsModule.showErrorMessage(message as string);
    }
  }
}

export const ConnectionIndecatoreModule = getModule(ConnectionIndecatore);
