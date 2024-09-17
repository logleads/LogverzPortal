/* eslint-disable unused-imports/no-unused-imports-ts */
import axios, { AxiosRequestConfig } from 'axios';
import { Buffer } from 'safer-buffer';
import SimplePeer from 'simple-peer/simplepeer.min';

import { BASE_URL, DEVELOPMENT_MODE, STAGE_NAME } from '~/constants';
import { BaseRequest, token } from '~/services/api/base-request';
import { ErrorsModule } from '~/store/modules/errors';
import { ServerConnectionModule } from '~/store/modules/server-connection';
import { UserModule } from '~/store/modules/user';
import { DataBaseTypes } from '~/types/data-base-type';
import { ParametersType } from '~/types/models/query-builder-types';
import { getSQLQuery } from '~/utils/getDefaultQuery';
import { getServerList } from '~/utils/getServerList';
import { parseDBAlias, parseDBEngine } from '~/utils/parseDBAlias';

import { QueryBuilderService } from './query-builder-service';

const END_OF_FILE_MESSAGE = 'EOF';
const MAX_RETRY_ATTEMPTS = 5;
const RETRY_DELAY = 2000; // in milliseconds

class RTCService {
  peer: any;
  config: any;
  TurnServerPassword: any;
  isConected: boolean = false;
  isQueryForInfo: boolean = false;
  isQueryForGetTable: boolean = false;
  receivedBuffers: any = [];
  retryAttempts: number = 0;

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
      };

      if (JSON.parse(UserModule.useTurnServer) === true) {
        const servers = getServerList(this.config, this.TurnServerPassword);
        config = { ...config, config: { iceServers: servers } };
      }

      console.log('ACTUAL CONFIG', config);
      this.peer = new SimplePeer(config);

      this.peer.on('signal', async (data2: { [k: string]: string }) => {
        const urlpath = 'WebRTC/Signal';
        const payload = JSON.stringify(data2);
        console.log('The signal:', data2);

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
              port: 443,
              withCredentials: true,
              url: `${STAGE_NAME}/${urlpath}`,
              data: payload,
            } as AxiosRequestConfig);

            // Ensure the peer is not destroyed and the state is appropriate
            if (!this.peer.destroyed && this.peer._pc.signalingState === 'have-local-offer') {
              this.peer.signal(answer.data);
            } else {
              console.warn(
                'Peer is in the wrong state or destroyed. Skipping setRemoteDescription.',
              );
            }
          } catch (e: any) {
            this.handleOfferError(e, callback);
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
            ServerConnectionModule.setDataToTables(decodedstring);
            callback(true, false);
            ServerConnectionModule.checkFinishConnections(decodedstring);
            ServerConnectionModule.setSendingStatus(false);
            console.log('Decoded string received and processed.');
          }
        } catch (e: any) {
          console.log('%c The server connection closed' + e, 'color: red');
        }
      });

      this.peer.on('connect', () => {
        this.isConected = true;
        ServerConnectionModule.setFlagIsConnectedToWebRTC(true);
        callback(true, false);
        console.log('Connected successfully.');
      });

      this.peer.on('close', () => {
        this.isConected = false;
        ServerConnectionModule.setFlagIsConnectedToWebRTC(false);
        callback(false, false);
        console.log('%c The server connection closed', 'color: red');
        this.retryConnection(callback);
      });

      this.peer.on('error', (err: Error) => {
        this.handleError(callback, err);
      });
    } catch (error: any) {
      this.handleError(callback, error);
    }
  }

  private handleError(callback: any, err: Error): void {
    console.error('Connection error:', err.message);
    this.isConected = false;
    ServerConnectionModule.setFlagIsConnectedToWebRTC(false);
    ServerConnectionModule.setSendingStatus(false);

    if (this.peer && !this.peer.destroyed) {
      this.retryConnection(callback);
    } else {
      console.warn('Peer is already destroyed, not retrying connection.');
    }
  }

  private handleOfferError(e: any, callback: any): void {
    ErrorsModule.showErrorMessage(e.message);
    console.log('Trouble in offer: ', e);
    ServerConnectionModule.manualConnect(false);
    ServerConnectionModule.connectionFetchingFinished();
    this.retryConnection(callback);
  }

  private retryConnection(callback: any): void {
    if (this.retryAttempts < MAX_RETRY_ATTEMPTS) {
      this.retryAttempts++;
      console.log(`Retrying connection attempt ${this.retryAttempts} of ${MAX_RETRY_ATTEMPTS}...`);

      if (this.peer && !this.peer.destroyed) {
        this.peer.destroy();
      }

      setTimeout(() => this.init(callback), RETRY_DELAY);
    } else {
      console.error('Max retry attempts reached. Could not establish connection.');
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
        this.peer?.send(query);
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async uploadDBAlias(): Promise<any> {
    try {
      const { data } = await QueryBuilderService.getDBAlias();
      const DBAlias = parseDBAlias(data.Parameter.Value);
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

    console.log('Sending SQL query for tables:', SQLQueryTables);
    this.peer?.send(SQLQueryTables);
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

    console.log('Sending SQL query for data by table name:', code);
    this.peer?.send(code);
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
