/* eslint-disable no-console */
import { alert } from 'devextreme/ui/dialog';
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';

import { SaveSettingService } from '~/services/api/save-setting-service';
import { store } from '~/store';

import { ServerConnectionModule } from './server-connection';
import { WindowName, WindowsModule } from './windows';

interface QuerySettingsI {
  Field: string;
  Operator: string;
  Value: string;
}

export interface DataI {
  DataBaseName: string;
  TableName: string;
  QuerySettings: QuerySettingsI[];
  Batch: {
    Start: string;
    End: string;
  };
  AnalysisType: string;
  CombinationQfQueries: string;
  CustomQuery: string;
  IsCustomQuery: boolean;
  Views: string;
  DataType: string;
  textEditor: string;
}

function createDefaultData(): DataI {
  return {
    DataBaseName: '',
    TableName: '',
    DataType: '',
    QuerySettings: [createQuerySettings()],
    Batch: {
      Start: '0',
      End: '500',
    },
    AnalysisType: 'Data table',
    CombinationQfQueries: 'OR',
    IsCustomQuery: false,
    CustomQuery: '',
    Views: 'Default',
    textEditor: '',
  };
}

function createQuerySettings(): QuerySettingsI {
  return {
    Field: '',
    Operator: '',
    Value: '',
  };
}

@Module({ dynamic: true, name: 'save-setting', store })
class SaveSetting extends VuexModule {
  dataT: Record<number, DataI> = {};
  key: number = 0;
  export: boolean = false;
  isOpenDialogWindow: boolean = false;
  //query permissions data
  isOpenSavePermissionDialog: boolean = false;
  isOpenDeleteRecordDialog: boolean = false;
  savedData: any = {};
  Owners: Array<{ name: string }> = [];
  Access: Array<{ name: string }> = [];

  @Mutation
  private SET_TEXT_EDITOR(v: string): void {
    this.dataT = {
      ...this.dataT,
      [this.key]: {
        ...this.dataT[this.key],
        textEditor: v,
      },
    };
  }

  @Mutation
  private SET_CUSTOM_QUERY(v: string): void {
    this.dataT = {
      ...this.dataT,
      [this.key]: {
        ...this.dataT[this.key],
        CustomQuery: v,
      },
    };
  }

  @Mutation
  private SET_DTYPE(v: string): void {
    this.dataT = {
      ...this.dataT,
      [this.key]: {
        ...this.dataT[this.key],
        DataType: v,
      },
    };
  }

  @Mutation
  private SET_DATA_T(v: DataI): void {
    this.dataT = { ...this.dataT, [this.key]: { ...v } };
  }

  @Mutation
  private OPEN_DIALOG_WINDOW(): void {
    this.isOpenDialogWindow = true;
  }
  @Mutation
  private OPEN_DELETE_RECORD_DIALOG(): void {
    this.isOpenDeleteRecordDialog = true;
  }

  @Mutation
  private CLOSE_DELETE_RECORD_DIALOG(): void {
    this.isOpenDeleteRecordDialog = false;
  }

  @Mutation
  private OPEN_SAVE_PERMISSION_DIALOG(): void {
    this.isOpenSavePermissionDialog = true;
  }

  @Mutation
  private CLOSE_SAVE_PERMISSION_DIALOG(): void {
    this.isOpenSavePermissionDialog = false;
  }

  @Mutation
  private SET_SAVED_DATA(data: any): void {
    this.savedData = data;
  }
  @Mutation
  private SET_OWNERS_DATA(data: any): void {
    // console.log('OWQN', data);
    this.Owners = data;
  }
  @Mutation
  private SET_ACCESS_DATA(data: any): void {
    this.Access = data;
  }

  @Mutation
  private CLOSE_DIALOG_WINDOW(): void {
    this.isOpenDialogWindow = false;
  }

  @Mutation
  private SET_EXPORT(v: boolean): void {
    this.export = v;
  }

  @Mutation
  private SET_VIEWS_ST(v: string): void {
    this.dataT = {
      ...this.dataT,
      [this.key]: {
        ...this.dataT[this.key],
        Views: v,
      },
    };
  }

  @Mutation
  private TRIGER_CUSTOM_QUERY(v: boolean): void {
    this.dataT = {
      ...this.dataT,
      [this.key]: {
        ...this.dataT[this.key],
        IsCustomQuery: v,
      },
    };
  }

  @Mutation
  private SET_ANALYSIS_TYPE(v: string): void {
    this.dataT = {
      ...this.dataT,
      [this.key]: {
        ...this.dataT[this.key],
        AnalysisType: v,
      },
    };
  }

  @Mutation
  private SET_DATA_BASE_NAME(v: string): void {
    this.dataT = {
      ...this.dataT,
      [this.key]: {
        ...this.dataT[this.key],
        DataBaseName: v,
      },
    };
  }

  @Mutation
  private SET_COMBINATION_OF_QUERIES(v: string): void {
    this.dataT = {
      ...this.dataT,
      [this.key]: {
        ...this.dataT[this.key],
        CombinationQfQueries: v,
      },
    };
  }

  @Mutation
  private SET_TABLE_NAME(v: string) {
    this.dataT = {
      ...this.dataT,
      [this.key]: {
        ...this.dataT[this.key],
        TableName: v,
      },
    };
  }

  @Mutation
  private ADD_QUERY_SETTINGS() {
    this.dataT = {
      ...this.dataT,
      [this.key]: {
        ...this.dataT[this.key],
        QuerySettings: [...this.dataT[this.key].QuerySettings, createQuerySettings()],
      },
    };
  }

  @Mutation
  private DELETE_QUERY_SETTINGS(id: number) {
    this.dataT = {
      ...this.dataT,
      [this.key]: {
        ...this.dataT[this.key],
        QuerySettings: [
          ...this.dataT[this.key].QuerySettings.filter(
            (item: QuerySettingsI, index) => index !== id,
          ),
        ],
      },
    };
  }

  @Mutation
  private SET_QUERY_SETTINGS_FIELD(dataT: { id: number; val: string }) {
    this.dataT = {
      ...this.dataT,
      [this.key]: {
        ...this.dataT[this.key],
        QuerySettings: this.dataT[this.key].QuerySettings.map(
          (item: QuerySettingsI, index: number) => {
            if (index === dataT.id) {
              return {
                ...item,
                Field: dataT.val,
              };
            } else {
              return item;
            }
          },
        ),
      },
    };
  }

  @Mutation
  private SET_QUERY_SETTINGS_OPERATOR(dataT: { id: number; val: string }) {
    this.dataT = {
      ...this.dataT,
      [this.key]: {
        ...this.dataT[this.key],
        QuerySettings: this.dataT[this.key].QuerySettings.map(
          (item: QuerySettingsI, index: number) => {
            if (index === dataT.id) {
              return {
                ...item,
                Operator: dataT.val,
              };
            } else {
              return item;
            }
          },
        ),
      },
    };
  }

  @Mutation
  private SET_QUERY_SETTINGS_VALUE(dataT: { id: number; val: string }) {
    this.dataT = {
      ...this.dataT,
      [this.key]: {
        ...this.dataT[this.key],
        QuerySettings: this.dataT[this.key].QuerySettings.map(
          (item: QuerySettingsI, index: number) => {
            if (index === dataT.id) {
              return {
                ...item,
                Value: dataT.val,
              };
            } else {
              return item;
            }
          },
        ),
      },
    };
  }

  @Mutation
  private SET_KEY(v: number) {
    this.key = v;
  }

  @Mutation
  private INIT() {
    // console.log('INIT');
    this.dataT[this.key] = { ...createDefaultData() };
  }

  @Mutation
  private SET_BATCH(v: { Start: string; End: string }) {
    this.dataT = {
      ...this.dataT,
      [this.key]: {
        ...this.dataT[this.key],
        Batch: v,
      },
    };
  }

  @Action
  public saveSetting(data: { key: number; name: string }) {
    SaveSettingService.setSetting(this.dataT[this.key], data.name);
  }
  @Action
  public savePermissionSetting(data: {
    unixTime: number;
    UsersQuery: string;
    Owners: any;
    Access: any;
  }) {
    SaveSettingService.setPermissionSetting(data);
  }

  @Action
  public loadSetting(data: DataI) {
    console.log(data, 'loadFunction check it ');
    if (ServerConnectionModule.isConnectedToWebRTC) {
      setTimeout(() => {
        this.SET_EXPORT(true);
        this.SET_DATA_T(data);
        console.log('set data');
        setTimeout(() => {
          console.log('export end');
          this.SET_EXPORT(false);
        }, 5000);
      }, 2000);
      WindowsModule.openWindow({ name: WindowName.ANALYTICS, index: undefined });
    } else {
      alert('Please connect to WebRTC', 'Something went wrong');
    }
  }

  @Action
  public saveDataBaseName(data: { key: number; name: string }) {
    this.SET_KEY(data.key);
    this.SET_DATA_BASE_NAME(data.name);
  }

  @Action
  public saveTableName(data: { key: number; name: string }) {
    this.SET_KEY(data.key);
    this.SET_TABLE_NAME(data.name);
  }

  @Action
  public addNewFilterLine(data: { key: number }) {
    this.SET_KEY(data.key);
    this.ADD_QUERY_SETTINGS();
  }

  @Action
  public deleteQuerySettings(data: { key: number; id: number }) {
    this.SET_KEY(data.key);
    this.DELETE_QUERY_SETTINGS(data.id);
  }

  @Action
  public setQuerySettingsField(data: { key: number; id: number; val: string }) {
    this.SET_KEY(data.key);
    this.SET_QUERY_SETTINGS_FIELD({ id: data.id, val: data.val });
  }

  @Action
  public setQuerySettingsOperation(data: { key: number; id: number; val: string }) {
    this.SET_KEY(data.key);
    this.SET_QUERY_SETTINGS_OPERATOR({ id: data.id, val: data.val });
  }

  @Action
  public setQuerySettingsVal(data: { key: number; id: number; val: string }) {
    this.SET_KEY(data.key);
    this.SET_QUERY_SETTINGS_VALUE({ id: data.id, val: data.val });
  }

  @Action
  public setViews(data: { key: number; val: string }) {
    this.SET_KEY(data.key);
    this.SET_VIEWS_ST(data.val);
  }

  @Action
  public init(key: number) {
    this.SET_KEY(key);
    this.INIT();
  }

  @Action
  public setCombinationQfQueries(data: { val: string; key: number }) {
    this.SET_KEY(data.key);
    this.SET_COMBINATION_OF_QUERIES(data.val);
  }

  @Action
  public setIsCustomQuery(data: { val: boolean; key: number }) {
    this.SET_KEY(data.key);
    this.TRIGER_CUSTOM_QUERY(data.val);
  }

  @Action
  public setCustomQuery(data: { val: string; key: number }) {
    this.SET_KEY(data.key);
    this.SET_CUSTOM_QUERY(data.val);
  }

  @Action
  public setAnalysisType(data: { val: string; key: number }) {
    this.SET_KEY(data.key);
    this.SET_ANALYSIS_TYPE(data.val);
  }

  @Action
  public setBatch(data: {
    key: number;
    data: {
      Start: string;
      End: string;
    };
  }) {
    this.SET_KEY(data.key);
    this.SET_BATCH(data.data);
  }

  @Action
  public setExport(data: { key: number; data: boolean }) {
    this.SET_KEY(data.key);
    this.SET_EXPORT(data.data);
  }
  @Action
  public setDType(data: { key: number; data: string }) {
    this.SET_KEY(data.key);
    this.SET_DTYPE(data.data);
  }

  @Action
  public openDialogWindow() {
    this.OPEN_DIALOG_WINDOW();
  }
  //belongs to query history
  @Action
  public openDeleteRecordDialog() {
    this.OPEN_DELETE_RECORD_DIALOG();
  }
  @Action
  public closeDeleteRecordDialog() {
    this.CLOSE_DELETE_RECORD_DIALOG();
  }
  @Action
  public openSavePermissionDialog() {
    this.OPEN_SAVE_PERMISSION_DIALOG();
  }
  @Action
  public closeSavePermissionDialog() {
    this.CLOSE_SAVE_PERMISSION_DIALOG();
  }
  @Action
  public setOwnersDATA(data: any) {
    console.log('SET OWNER ACTION', data);
    this.SET_OWNERS_DATA(data);
  }
  @Action
  public setAccessDATA(data: any) {
    this.SET_ACCESS_DATA(data);
  }
  @Action
  public setSavedQueryData(data: any) {
    this.SET_SAVED_DATA(data.data);
    if (data.data.Owners) {
      // console.log('data.data.Owners', data.data.Owners);
      const own = data.data.Owners.map((item: string) => {
        return { name: item };
      });
      // this.setOwners(own);
      this.SET_OWNERS_DATA(own);
    }
    if (data.data.Access) {
      const acc = data.data.Access.map((item: string) => {
        return { name: item };
      });
      // console.log('ACC => ', acc);
      // this.setAccess(acc);
      this.SET_ACCESS_DATA(acc);
    }
  }

  @Action
  public closeDialogWindow() {
    this.CLOSE_DIALOG_WINDOW();
  }

  @Action
  public setTextEditor(data: { key: number; data: string }) {
    this.SET_KEY(data.key);
    this.SET_TEXT_EDITOR(data.data);
  }
}

export const SaveSettingModule = getModule(SaveSetting);
