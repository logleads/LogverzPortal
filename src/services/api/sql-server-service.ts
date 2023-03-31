/* eslint-disable no-console */
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import SimplePeer from 'simple-peer/simplepeer.min';

import { BASE_URL, DEVELOPMENT_MODE, STAGE_NAME } from '~/constants';
import { BaseRequest, token } from '~/services/api/base-request';
import { ErrorsModule } from '~/store/modules/errors';
import { ServerConnectionModule } from '~/store/modules/server-connection';
import { ConfigType, ParameterList, ParametersType } from '~/types/models/query-builder-types';

export class SqlServerService {
  static peer: SimplePeer.Instance;

  static getTurnServerPassword(): AxiosPromise<ParameterList> {
    const Parameters: ParametersType = {
      Name: '/Logverz/Settings/TurnSrvPassword',
      WithDecryption: true,
    };
    const parameterEncode = encodeURI(JSON.stringify(Parameters));
    return BaseRequest.get(
      `${STAGE_NAME}/Info?service=ssm&apicall=GetParameter&Parameters=${parameterEncode}`,
    );
  }

  static getConfig(): AxiosPromise<{ iceServers: Array<ConfigType> }> {
    return BaseRequest.get(`${STAGE_NAME}/HTTP/S3/WRTCB/webrtc.config`);
  }

  static async establishP2PConnection(serverList: any[]): Promise<void> {
    const config = {
      initiator: true,
      trickle: true,
      objectMode: false,
      //iceCompleteTimeout: 4000,
      //config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }] },
      config: {
        // iceServers: [{ urls: urls + ':3478', credential: key, username: username }],
        iceserver: serverList,
      },
    };
    this.peer = new SimplePeer(config);

    this.peer.on('signal', async (data2: { [k: string]: string }) => {
      const urlpath = 'WebRTC/Signal';
      // key needs to be get from request (Password)
      const payload = JSON.stringify(data2);

      if (data2.type == 'offer') {
        try {
          const answer = await axios({
            baseURL: BASE_URL,
            headers:
              process.env.NODE_ENV === DEVELOPMENT_MODE
                ? {
                    'content-type': 'application/x-www-form-urlencoded',
                    Authorization: `Bearer ${token}`,
                  }
                : { 'content-type': 'application/x-www-form-urlencoded' },
            method: 'POST',
            //host:host, //'127.0.0.1'   host
            port: 443,
            withCredentials: true,
            url: `${STAGE_NAME}/${urlpath}`, // '/'
            data: payload,
          } as AxiosRequestConfig);

          this.peer.signal(answer.data);
        } catch (e: any) {
          ErrorsModule.showErrorMessage(e.message);
          // eslint-disable-next-line no-console
          console.log('trouble in offer  ', e);
          ServerConnectionModule.manualConnect(false);
          ServerConnectionModule.connectionFetchingFinished();
        }
      }
    });

    this.peer.on('data', (data: string) => {
      ServerConnectionModule.setTables(data);
      ServerConnectionModule.setReceivedData(data);
      ServerConnectionModule.setSendingStatus(false);
    });

    this.peer.on('connect', () => {
      // eslint-disable-next-line no-console
      console.log('connection...');
      ServerConnectionModule.shouldReconnect(false);
      ServerConnectionModule.connectingFailed(false);
      ServerConnectionModule.getTablesAfterConnect();
      ServerConnectionModule.manualConnect(true);
      ServerConnectionModule.setFlagIsConnectedToWebRTC(true);
      ServerConnectionModule.connectionFetchingFinished();
    });
    //
    this.peer.on('close', () => {
      ServerConnectionModule.manualConnect(false);
      ServerConnectionModule.connectionFetchingFinished();
      ServerConnectionModule.connectingFailed(true);
      ServerConnectionModule.setFlagIsConnectedToWebRTC(false);

      // eslint-disable-next-line no-console
      console.log('The server connection closed');
    });

    this.peer.on('error', (err: Error) => {
      // eslint-disable-next-line no-console
      console.log('The following error happened:' + err);
      ServerConnectionModule.shouldReconnect(true);
      //ServerConnectionModule.connectingFailed(true);
      ServerConnectionModule.setSendingStatus(false);
      ServerConnectionModule.setFlagIsConnectedToWebRTC(false);
    });
  }

  static sendSql(payload: {
    LogverzDBFriendlyName: string;
    DBTableName: string;
    DataType: string;
    QueryParams: any;
  }): void {
    const SQLQueryTables = JSON.stringify({
      query: `{"LogverzDBFriendlyName":"${payload.LogverzDBFriendlyName}","DBTableName":"${payload.DBTableName}","DataType":"${payload.DataType}","Mode":"findAll","QueryParams":${payload.QueryParams}}`,
    });
    const hardCode = JSON.stringify({
      query: `{"LogverzDBFriendlyName":"DefaultDB","Mode":"Native","QueryParams":"Select * FROM \\"${payload.DBTableName}\\""}`,
    });

    // eslint-disable-next-line no-console
    console.log('sending...   ', `${hardCode}`);
    this.peer.send(hardCode);
  }

  static getTables(payload: { LogverzDBFriendlyName: string }): void {
    const SQLQueryTables = JSON.stringify({
      query: `{"LogverzDBFriendlyName":"${payload.LogverzDBFriendlyName}","Mode":"ListTables"}`,
    });

    // eslint-disable-next-line no-console
    console.log('sending...   ', `${SQLQueryTables}`);
    this.peer.send(SQLQueryTables);
  }

  // static sendEvryThing(cmd: string): void {
  //   console.log(cmd)
  //   this.peer.send(cmd)
  // }

  static disconnectSQLServer(): void {
    ServerConnectionModule.shouldReconnect(false);
    // this.peer.removeAllListeners('signal');
    // this.peer.removeAllListeners('data');
    // this.peer.removeAllListeners('connect');
    // this.peer.removeAllListeners('close');
    // this.peer.removeAllListeners('error');
    // this.peer.destroy();
  }
}
