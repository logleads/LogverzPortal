/* eslint-disable no-console */
import axios, { AxiosRequestConfig } from 'axios';
// import * as buffer from 'buffer';
import { Buffer } from 'safer-buffer';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import SimplePeer from 'simple-peer/simplepeer.min';

import { BASE_URL, DEVELOPMENT_MODE, STAGE_NAME } from '~/constants';
import { BaseRequest, token } from '~/services/api/base-request';
import { ErrorsModule } from '~/store/modules/errors';
import { ServerConnectionModule } from '~/store/modules/server-connection';
import { UserModule } from '~/store/modules/user';
import { DataBaseTypes } from '~/types/data-base-type';
// import { ServerConnectionModule } from '~/store/modules/server-connection';
import { ParametersType } from '~/types/models/query-builder-types';
import { getSQLQuery } from '~/utils/getDefaultQuery';
import { getServerList } from '~/utils/getServerList';
import { parseDBAlias, parseDBEngine } from '~/utils/parseDBAlias';

// (window as any).Buffer = buffer;
import { QueryBuilderService } from './query-builder-service';
const END_OF_FILE_MESSAGE = 'EOF';
class RTCService {
  peer: any;
  config: any;
  TurnServerPassword: any;
  isConected: any;
  isQueryForInfo: any;
  isQueryForGetTable: any;
  receivedBuffers: any = [];

  async getTurnServerPassword(): Promise<void> {
    try {
      const Parameters: ParametersType = {
        Name: '/Logverz/Settings/TurnSrvPassword',
        WithDecryption: true,
      };
      const parameterEncode = encodeURI(JSON.stringify(Parameters));
      const { data } = await BaseRequest.get(
        `${STAGE_NAME}/Info?service=ssm&apicall=GetParameter&Parameters=${parameterEncode}`,
      );

      this.TurnServerPassword = data.Parameter.Value;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
  async uploadConfig(): Promise<void> {
    try {
      const { data } = await BaseRequest.get(`${STAGE_NAME}/HTTP/S3/WRTCB/webrtc.config`);

      ServerConnectionModule.turnServerDetail(data);
      this.config = data.iceServers;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
  async init(callback: any): Promise<any> {
    try {
      callback(false, true);
      await this.uploadConfig();
      await this.getTurnServerPassword();
      let config: any = {
        initiator: true,
        trickle: true,
        objectMode: false,
        //,iceCompleteTimeout: 4000
      };

      if (JSON.parse(UserModule.useTurnServer) === true) {
        const servers = getServerList(this.config, this.TurnServerPassword);
        config = { ...config, config: { iceServers: servers } };
      }
      console.log('ACTUAL CONFIG', config);
      this.peer = new SimplePeer(config);

      this.peer.on('signal', async (data2: { [k: string]: string }) => {
        const urlpath = 'WebRTC/Signal';
        // key needs to be get from request (Password)
        const payload = JSON.stringify(data2);
        console.log('The signal:');
        console.log(data2);
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

      this.peer.on('data', (data: Uint8Array) => {
        try {
          let decodedstring = '';
          if (data.toString() !== END_OF_FILE_MESSAGE) {
            this.receivedBuffers.push(data);
          } else {
            for (let i = 0; i < this.receivedBuffers.length; i++) {
              decodedstring += Buffer.from(this.receivedBuffers[i]).toString('utf8');
            }
            this.receivedBuffers = [];
            ServerConnectionModule.setTables(decodedstring);
            // console.log('firstIndex', decodedstring);
            ServerConnectionModule.setDataToTables(decodedstring);
            callback(true, false);
            ServerConnectionModule.checkFinishConnections(decodedstring);
            ServerConnectionModule.setSendingStatus(false);
            console.log('--------------------------decodedstring---------------------------------');
          }
        } catch (e: any) {
          console.log('%c The server connection closed' + e, 'color: red');
        }
      });

      this.peer.on('connect', () => {
        // eslint-disable-next-line no-console
        this.isConected = true;
        ServerConnectionModule.setFlagIsConnectedToWebRTC(true);

        callback(true, false);
        console.log('connection...');
      });

      this.peer.on('close', () => {
        this.isConected = false;
        ServerConnectionModule.setFlagIsConnectedToWebRTC(false);

        callback(false, false);
        console.log('%c The server connection closed', 'color: red');
      });

      this.peer.on('error', (err: Error) => {
        // eslint-disable-next-line no-console
        callback(false, false);
        this.isConected = false;
        ServerConnectionModule.setFlagIsConnectedToWebRTC(false);
        ServerConnectionModule.setSendingStatus(false);
        console.log('%c The following error: any happened:' + err, 'color: red');
      });
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async sendQuery(cmd: string) {
    try {
      if (this.isConected) {
        this.isQueryForInfo = true;
        const query = JSON.stringify({
          query: cmd,
        });
        console.log(query, 'query');
        this.peer.send(query);
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async uploadDBAlias(): Promise<any> {
    try {
      // console.log('181 roger');
      const { data } = await QueryBuilderService.getDBAlias();
      const DBAlias = parseDBAlias(data.Parameter.Value);
      // console.log('184', DBAlias);
      const DBEngine = parseDBEngine(data.Parameter.Value);
      return { DBAlias: DBAlias, DBEngine: DBEngine };
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getTables(payload: { LogverzDBFriendlyName: string }): Promise<void> {
    this.isQueryForGetTable = true;
    const SQLQueryTables = JSON.stringify({
      query: `{"LogverzDBFriendlyName": "${payload.LogverzDBFriendlyName}","Mode": "ListTables","QueryParams": {"where": {"Table Name":{"<like>":".*"}}}}\n`,
    });

    // eslint-disable-next-line no-console
    console.log('2sending...   ', `${SQLQueryTables}`);
    this.peer.send(SQLQueryTables);
  }

  async getDataByTableName(payload: {
    LogverzDBFriendlyName: string;
    DBTableName: string;
    dataBaseEngineItems: any;
  }): Promise<void> {
    let dbEngine = '';
    if (payload.dataBaseEngineItems.length > 0) {
      const data = payload.dataBaseEngineItems.find(
        (engine: any) => engine.name == payload.LogverzDBFriendlyName,
      );
      // console.log("engineData",data)
      if (data.value.includes('sqlserver')) {
        dbEngine = DataBaseTypes.MSSQL;
      } else {
        dbEngine = data.value;
      }
    }
    this.isQueryForInfo = true;

    const code = JSON.stringify({
      query: `{"LogverzDBFriendlyName":"${
        payload.LogverzDBFriendlyName
      }","Mode":"Native","QueryParams":${getSQLQuery(
        payload.LogverzDBFriendlyName,
        payload.DBTableName,
        dbEngine,
      )}}`,
    });

    // eslint-disable-next-line no-console
    console.log('1sending...   ', `${code}`);

    this.peer.send(code);
  }

  endQueryForInfo() {
    this.isQueryForInfo = false;
  }

  endQueryForTable() {
    this.isQueryForGetTable = false;
  }
}

const RTCServiceObj = new RTCService();

export default RTCServiceObj;
