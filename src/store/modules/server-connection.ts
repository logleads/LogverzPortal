/* eslint-disable no-console */
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';

import RTCServiceObj from '~/services/api/rtc-service';
import { SqlServerService } from '~/services/api/sql-server-service';
import { store } from '~/store';
import { ErrorsModule } from '~/store/modules/errors';
import { QueryBuilderModule } from '~/store/modules/query-builder';
import { ConfigType } from '~/types/models/query-builder-types';
import { getServerList } from '~/utils/getServerList';

@Module({
  dynamic: true,
  name: 'server-connection',
  store,
})
class ServerConnection extends VuexModule {
  isConnectionFetching = false;
  connected = false;
  isShouldReconnect = false;
  turnServerPassword = '';
  isSending = false;
  isStreamBusy = false;
  tables: unknown;
  isWaitingForTables = false;
  isWaitingForData = false;
  failedCount = 0;
  isConnectedToWebRTC = false;
  isFinishConnected = false;
  isDoingQuery = false;
  data = '';
  serverDetails: any = [];

  config: ConfigType[] = [];

  @Mutation
  private SET_IS_CONNECTED_TO_WEB_RTC(value: boolean) {
    this.isConnectedToWebRTC = value;
  }

  @Mutation
  private SET_CONNECTED_STATUS(value: boolean) {
    this.connected = value;
  }

  @Mutation
  private SET_BUSY_STREAM_STATUS(value: boolean) {
    this.isStreamBusy = value;
  }

  @Mutation
  private SET_IS_WAITING_FOR_DATA(value: boolean) {
    this.isWaitingForData = value;
  }

  @Mutation
  private SET_SHOULD_RECONNECT(value: boolean) {
    this.isShouldReconnect = value;
  }

  @Mutation
  private SET_FAILED_COUNT(value: number) {
    this.failedCount = value;
  }

  @Mutation
  private SET_IS_SENDING(value: boolean) {
    this.isSending = value;
  }

  @Mutation
  private SET_IS_FINISH_CONNECTED(value: boolean) {
    this.isFinishConnected = value;
  }

  @Mutation
  private SET_IS_DOING_QUERY(value: boolean) {
    this.isDoingQuery = value;
  }

  @Mutation
  private SET_IS_CONNECTION_FETCHING(value: boolean) {
    this.isConnectionFetching = value;
  }

  @Mutation
  private SET_SELECT_VALUE(payload: { label: string; value: string }): void {
    switch (payload.label) {
      case 'turnServerPassword':
        this.turnServerPassword = payload.value;
        break;
    }
  }

  @Mutation
  private SET_CONFIG_TYPE(value: ConfigType[]) {
    this.config = value;
  }

  @Mutation
  private SET_WAITED_STATUS(value: boolean) {
    this.isWaitingForTables = value;
  }
  @Mutation
  private SET_TURN_SERVER_DETAIL(value: any) {
    this.serverDetails = value;
  }

  @Action
  public setTables(data: string) {
    if (this.isFinishConnected && RTCServiceObj.isQueryForGetTable) {
      QueryBuilderModule.setAvailableTables(
        data.split(',').map(i => i.replace(' ', '').replace(/[\[\]"']+/g, '')),
      );

      this.SET_WAITED_STATUS(false);
      this.SET_BUSY_STREAM_STATUS(false);
      RTCServiceObj.endQueryForTable();
    }
  }

  @Action
  public setBusyStream(value: boolean) {
    this.SET_BUSY_STREAM_STATUS(value);
  }

  @Action
  public shouldReconnect(value: boolean) {
    this.SET_SHOULD_RECONNECT(value);
  }

  @Action
  public setReceivedData(value: string) {
    if (this.isWaitingForData) {
      QueryBuilderModule.setData(value);
      this.SET_IS_WAITING_FOR_DATA(false);
      this.SET_BUSY_STREAM_STATUS(false);
    }
  }

  @Action
  public stopReconnect() {
    this.SET_FAILED_COUNT(0);
    this.SET_SHOULD_RECONNECT(false);
  }

  @Action
  public connectingFailed(isFailed: boolean) {
    if (isFailed) {
      this.SET_FAILED_COUNT(this.failedCount + 1);
    } else {
      this.SET_FAILED_COUNT(0);
    }
  }

  @Action
  public getTablesAfterConnect() {
    this.SET_BUSY_STREAM_STATUS(true);
    this.SET_WAITED_STATUS(false);
    const timeout = setTimeout(() => {
      this.SET_WAITED_STATUS(true);
      // this.getTables();
      // eslint-disable-next-line no-console
      clearTimeout(timeout);
    }, 6000);
  }

  @Action
  public getTables(LogverzDBFriendlyName: string) {
    console.log('%c send query to back' + QueryBuilderModule.dataBaseCurrentAlias, 'color:#733');
    // this.setIsDoingQuery(true)
    this.SET_BUSY_STREAM_STATUS(true);
    this.setSendingStatus(true);
    try {
      RTCServiceObj.getTables({ LogverzDBFriendlyName });
    } catch (e: any) {}
    this.SET_BUSY_STREAM_STATUS(false);
  }

  @Action
  public setSendingStatus(value: boolean) {
    if (value !== this.isSending) {
      this.SET_IS_SENDING(value);
    }
  }

  @Action
  public setSelectValue(payload: { label: string; value: string }): void {
    this.SET_SELECT_VALUE(payload);
  }

  @Action
  public manualConnect(value: boolean) {
    this.SET_CONNECTED_STATUS(value);
  }

  @Action
  public async getConfig() {
    try {
      const response = await SqlServerService.getConfig();
      console.log('@', response.data);
      this.SET_CONFIG_TYPE(response.data.iceServers);
    } catch (e: any) {
      ErrorsModule.showErrorMessage(e.message);
    }
  }

  @Action
  public async getTurnServerPassword() {
    try {
      const response = await SqlServerService.getTurnServerPassword();
      this.SET_SELECT_VALUE({ label: 'turnServerPassword', value: response.data.Parameter.Value });
    } catch (e: any) {
      ErrorsModule.showErrorMessage(e.message);
    } finally { /* empty */ }
  }

  @Action
   setFlagIsConnectedToWebRTC(value: boolean) {
    this.SET_IS_CONNECTED_TO_WEB_RTC(value);
  }

  @Action
  public async connectWithDB() {
    this.SET_IS_CONNECTION_FETCHING(true);
    try {
      console.log('action connected ');
      await this.getConfig();
      await this.getTurnServerPassword();
      const serverInfo = await getServerList(this.config, this.turnServerPassword);
      await SqlServerService.establishP2PConnection(serverInfo);
    } catch (e: any) {
      ErrorsModule.showErrorMessage(e.message);
      // eslint-disable-next-line no-console
      console.log('connectWithDB', e.message, 'SET_IS_CONNECTION_FETCHING');
      this.SET_IS_CONNECTION_FETCHING(false);
      this.SET_IS_CONNECTED_TO_WEB_RTC(false);
      this.SET_CONNECTED_STATUS(false);
    }
  }

  @Action
  public async sendQuery(key: number) {
    this.SET_BUSY_STREAM_STATUS(true);
    this.setSendingStatus(true);
    this.SET_IS_WAITING_FOR_DATA(true);
    console.log(
      'dataBaseCurrentAlias',
      QueryBuilderModule.dataForAllWindows[key].dataBaseCurrentAlias,
    );
    try {
      await RTCServiceObj.getDataByTableName({
        LogverzDBFriendlyName: QueryBuilderModule.dataForAllWindows[key].dataBaseCurrentAlias,
        DBTableName: QueryBuilderModule.dataForAllWindows[key].currentAvailableTable,
        dataBaseEngineItems: QueryBuilderModule.dataForAllWindows[key].dataBaseEngineItems,
      });
      this.setSendingStatus(false);
    } catch (e: any) {
      console.log('ERROR:', e);
      ErrorsModule.showErrorMessage(e.message);
    }
  }

  @Action
  public async disconnectDataBase() {
    try {
      await SqlServerService.disconnectSQLServer();
    } catch (e: any) {
      ErrorsModule.showErrorMessage(e.message);
    }
  }

  @Action
  public connectionFetchingFinished() {
    this.SET_IS_CONNECTION_FETCHING(false);
  }

  @Action
  setWaitedStatus() {
    this.SET_WAITED_STATUS(true);
  }

  @Action
  public checkFinishConnections(data: string) {
    if (data.includes('f8888')) {
      this.SET_IS_FINISH_CONNECTED(true);
    }
  }
  @Action
  public setIsDoingQuery(value: boolean) {
    this.SET_IS_DOING_QUERY(value);
  }
  @Action
  public turnServerDetail(value: any) {
    this.SET_TURN_SERVER_DETAIL(value);
  }

  @Action
  public setDataToTables(data: any): void {
    if (RTCServiceObj.isQueryForInfo && this.isFinishConnected) {
      // console.log('finish connection', data);
      QueryBuilderModule.setData(data);
      this.SET_IS_WAITING_FOR_DATA(false);
      this.SET_BUSY_STREAM_STATUS(false);

      RTCServiceObj.endQueryForInfo();
    }
  }
}

export const ServerConnectionModule = getModule(ServerConnection);
