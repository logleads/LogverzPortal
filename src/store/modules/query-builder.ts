/* eslint-disable no-console */
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';

import { QueryBuilderService } from '~/services/api/query-builder-service';
import RTCServiceObj from '~/services/api/rtc-service';
import { store } from '~/store';
import { ErrorsModule } from '~/store/modules/errors';
import { ServerConnectionModule } from '~/store/modules/server-connection';
import { logicalOperatorType, MainQuery } from '~/types/common';
import {
  CloudTrailDataResponse,
  DataType,
  QueryBuilderLabels,
  QueryBuilderRule,
} from '~/types/models/query-builder-types';
// import { parseDBAlias } from '~/utils/parseDBAlias';
import { parseParametersList } from '~/utils/parseParametersList';

import { SaveSettingModule } from './save-setting';

interface QueryBuilderState {
  isFetchingTableKeys: boolean;
  isDBAliasFetching: boolean;
  isTablesDataTypeFetching: boolean;
  exportFiles: string;
  query: MainQuery;
  rules: Array<QueryBuilderRule> | null;
  noDataType: boolean;

  labels: QueryBuilderLabels;

  dataBaseAliasItems: string[];
  dataBaseEngineItems: any;
  dataBaseCurrentAlias: string;
  LogverzEngineType: string;
  availableTables: string[];
  currentAvailableTable: string;
  currentDataType: DataType;

  forbidden: { status: boolean; reason: string };

  data: CloudTrailDataResponse[] | null;

  togglingExport: boolean;
}

function defaultInitState(): QueryBuilderState {
  return {
    isFetchingTableKeys: false,
    isDBAliasFetching: false,
    isTablesDataTypeFetching: false,
    exportFiles: 'CSV',
    query: {
      logicalOperator: logicalOperatorType.OR,
      children: [],
    },
    rules: null,
    noDataType: false,

    labels: {
      matchType: 'Match Type',
      matchTypes: [
        { id: 'AND', label: 'And' },
        { id: 'OR', label: 'Or' },
      ],
      addRule: 'Add Rule',
      removeRule: null,
      addGroup: null,
      removeGroup: null,
      textInputPlaceholder: 'value',
    },

    dataBaseAliasItems: [],
    dataBaseEngineItems: [],
    dataBaseCurrentAlias: '',
    LogverzEngineType: '',
    availableTables: [],
    currentAvailableTable: '',
    currentDataType: DataType.CLOUD_TRAIL,

    forbidden: { status: false, reason: '' },

    data: null,

    togglingExport: false,
  };
}

@Module({ dynamic: true, name: 'query-builder', store })
class QueryBuilder extends VuexModule {
  dataForAllWindows: Record<number, any> = {};
  key: Nullable<number> = null;
  isFetchingTableKeys = false;
  isDBAliasFetching = false;
  isTablesDataTypeFetching = false;
  exportFiles = 'CSV';
  query: MainQuery = {
    logicalOperator: logicalOperatorType.OR,
    children: [],
  };
  rules: Array<QueryBuilderRule> | null = null;
  noDataType = false;

  labels: QueryBuilderLabels = {
    matchType: 'Match Type',
    matchTypes: [
      { id: 'AND', label: 'And' },
      { id: 'OR', label: 'Or' },
    ],
    addRule: 'Add Rule',
    removeRule: null,
    addGroup: null,
    removeGroup: null,
    textInputPlaceholder: 'value',
  };

  dataBaseAliasItems: string[] = [];
  dataBaseEngineItems: string[] = [];
  dataBaseCurrentAlias = '';
  LogverzEngineType = '';
  availableTables: string[] = [];
  currentAvailableTable: string = '';
  currentDataType: DataType = DataType.CLOUD_TRAIL;

  forbidden: { status: boolean; reason: string } = { status: false, reason: '' };

  data: CloudTrailDataResponse[] | null = null;

  togglingExport = false;

  @Mutation
  private SET_SHOW_COLLUMS(value: [string]) {
    this.dataForAllWindows = {
      ...this.dataForAllWindows,
      [this.key as number]: { ...this.dataForAllWindows[this.key as number], showCollums: value },
    };
  }

  @Mutation
  private SET_SELECTED_VIEWS_NAME(value: string) {
    this.dataForAllWindows = {
      ...this.dataForAllWindows,
      [this.key as number]: {
        ...this.dataForAllWindows[this.key as number],
        selectedViewsName: value,
      },
    };
  }

  @Mutation
  private SET_VIEWS(views: any) {
    this.dataForAllWindows = {
      ...this.dataForAllWindows,
      [this.key as number]: { ...this.dataForAllWindows[this.key as number], views },
    };
  }

  @Mutation
  private SET_IS_SHOW_TABLE(isShowTable: boolean) {
    this.dataForAllWindows = {
      ...this.dataForAllWindows,
      [this.key as number]: { ...this.dataForAllWindows[this.key as number], isShowTable },
    };
  }

  @Mutation
  private SET_DATA(value: any) {
    console.log('162 Data for', value);
    console.log('this.key', this.key);
    this.dataForAllWindows = {
      ...this.dataForAllWindows,
      [this.key as number]: { ...this.dataForAllWindows[this.key as number], data: value },
    };
    // this.data = value;
  }

  @Mutation
  private TOGGLE_FOR_EXPORT() {
    console.log(
      'Mutating togglingExport',
      this.dataForAllWindows[this.key as number].togglingExport,
    );
    this.dataForAllWindows = {
      ...this.dataForAllWindows,
      [this.key as number]: {
        ...this.dataForAllWindows[this.key as number],
        togglingExport: !this.dataForAllWindows[this.key as number].togglingExport,
      },
    };
  }

  @Mutation
  private SET_FORBIDDEN(payload: { status: boolean; reason: string }) {
    this.dataForAllWindows = {
      ...this.dataForAllWindows,
      [this.key as number]: {
        ...this.dataForAllWindows[this.key as number],
        forbidden: payload,
      },
    };
  }

  @Mutation
  private SET_IS_NO_DATA_TYPE(value: boolean) {
    this.dataForAllWindows = {
      ...this.dataForAllWindows,
      [this.key as number]: {
        ...this.dataForAllWindows[this.key as number],
        noDataType: value,
      },
    };
  }

  @Mutation
  private SET_CURRENT_DATA_TYPE(value: DataType) {
    this.dataForAllWindows = {
      ...this.dataForAllWindows,
      [this.key as number]: {
        ...this.dataForAllWindows[this.key as number],
        currentDataType: value,
      },
    };
  }

  @Mutation
  private SET_AVAILABLE_TABLES(tables: string[]) {
    this.dataForAllWindows = {
      ...this.dataForAllWindows,
      [this.key as number]: {
        ...this.dataForAllWindows[this.key as number],
        availableTables: tables,
      },
    };
  }

  @Mutation
  private SET_DB_ALIAS_ITEMS(value: Array<string>) {
    this.dataForAllWindows = {
      ...this.dataForAllWindows,
      [this.key as number]: {
        ...this.dataForAllWindows[this.key as number],
        dataBaseAliasItems: value,
      },
    };
  }
  @Mutation
  private SET_DB_ENGINE_ITEMS(value: Array<string>) {
    this.dataForAllWindows = {
      ...this.dataForAllWindows,
      [this.key as number]: {
        ...this.dataForAllWindows[this.key as number],
        dataBaseEngineItems: value,
      },
    };
  }

  @Mutation
  private COMMON_SET_FETCHING(payload: { label: string; value: boolean }) {
    if (!this.dataForAllWindows[this.key as number]) {
      return;
    }
    switch (payload.label) {
      case 'isFetching':
        this.dataForAllWindows = {
          ...this.dataForAllWindows,
          [this.key as number]: {
            ...this.dataForAllWindows[this.key as number],
            isFetchingTableKeys: payload.value,
          },
        };
        break;
      case 'isDBAliasFetching':
        this.dataForAllWindows = {
          ...this.dataForAllWindows,
          [this.key as number]: {
            ...this.dataForAllWindows[this.key as number],
            isDBAliasFetching: payload.value,
          },
        };
        break;
      case 'isTablesDataTypeFetching':
        this.dataForAllWindows = {
          ...this.dataForAllWindows,
          [this.key as number]: {
            ...this.dataForAllWindows[this.key as number],
            isTablesDataTypeFetching: payload.value,
          },
        };
        break;
    }
  }

  @Mutation
  private SET_RULES(rules: Array<QueryBuilderRule>): void {
    this.dataForAllWindows = {
      ...this.dataForAllWindows,
      [this.key as number]: {
        ...this.dataForAllWindows[this.key as number],
        rules: rules,
      },
    };
  }
  @Mutation
  private SET_TABLE_DATA_FORMAT(dataFormat: string): void {
    this.dataForAllWindows = {
      ...this.dataForAllWindows,
      [this.key as number]: {
        ...this.dataForAllWindows[this.key as number],
        tableDataFormat: dataFormat,
      },
    };
  }

  @Mutation
  private SET_QUERY(value: MainQuery) {
    this.dataForAllWindows = {
      ...this.dataForAllWindows,
      [this.key as number]: {
        ...this.dataForAllWindows[this.key as number],
        query: value,
      },
    };
  }

  @Mutation
  private SET_CURRENT_AVAILABLE_TABLE(value: string) {
    this.dataForAllWindows = {
      ...this.dataForAllWindows,
      [this.key as number]: {
        ...this.dataForAllWindows[this.key as number],
        currentAvailableTable: value,
      },
    };
  }

  @Mutation
  private SET_DATA_BASE_CURRENT_ALIAS(value: string) {
    console.log('db-2', value, this.key);
    this.dataForAllWindows = {
      ...this.dataForAllWindows,
      [this.key as number]: {
        ...this.dataForAllWindows[this.key as number],
        dataBaseCurrentAlias: value,
      },
    };
  }

  @Action
  public toggleForExport(key: number) {
    this.SET_KEY_FOR_WINDOW(key);
    this.TOGGLE_FOR_EXPORT();
  }

  @Action
  public setKeyForWIndow(key: number) {
    this.SET_KEY_FOR_WINDOW(key);
  }

  @Action
  public setData(value: string): void {
    console.log('SETTING DATA', value);
    const response = JSON.parse(value);

    if (response.status === 'Deny') {
      this.SET_FORBIDDEN({ status: true, reason: response.Reason });
    } else {
      this.SET_DATA(response);
      this.SET_FORBIDDEN({ status: false, reason: '' });
    }
  }

  // TODO 1
  @Action
  public async setCurrentTable({ value, key }: { value: string; key: number }) {
    this.SET_KEY_FOR_WINDOW(key);
    this.SET_CURRENT_AVAILABLE_TABLE(value);
    this.SET_DATA(null);
    await this.getTableDataType({
      databaseName: this.dataForAllWindows[key as number].dataBaseCurrentAlias,
      DatasetName: value,
    });
  }

  @Action
  public async setAvailableDB({ value, key }: { value: string; key: number }) {
    this.SET_KEY_FOR_WINDOW(key);
    console.log(
      '**looking***',
      value,
      this.dataForAllWindows[key as number].dataBaseCurrentAlias,
      key,
    );
    console.log('db-3');
    if (value !== this.dataForAllWindows[key as number].dataBaseCurrentAlias) {
      this.SET_DATA_BASE_CURRENT_ALIAS(value);
      this.SET_DATA(null);
      await ServerConnectionModule.getTables(value);
    }
  }

  @Action
  public setAvailableTables(value: string[]) {
    this.SET_AVAILABLE_TABLES(value);
  }

  @Action
  public setQuery(payload: { value: MainQuery; key: number }) {
    this.SET_KEY_FOR_WINDOW(payload.key);
    this.SET_QUERY(payload.value);
  }

  @Action
  public async getTableValues(dataType: DataType) {
    try {
      this.COMMON_SET_FETCHING({ label: 'isFetching', value: true });
      const response = await QueryBuilderService.getTableParametersList(dataType);
      const rules = parseParametersList(response.data.Parameter.Value);
      const tableDataFormat = JSON.parse(response.data.Parameter.Value)?.S3SelectParameters?.IO
        ?.InputSerialization;
      const data = JSON.parse(response.data.Parameter.Value).Views.reduce((acc: any, item: any) => {
        return { ...acc, ...item };
      }, {});
      tableDataFormat.CSV ? this.SET_TABLE_DATA_FORMAT('csv') : this.SET_TABLE_DATA_FORMAT('json');
      this.SET_VIEWS(data);
      this.SET_SHOW_COLLUMS(data.Default);
      this.SET_SELECTED_VIEWS_NAME('Default');
      this.SET_RULES(rules);
      this.SET_CURRENT_DATA_TYPE(dataType);
      this.SET_IS_SHOW_TABLE(true);
    } catch (e: any) {
      ErrorsModule.showErrorMessage(e.message);
    } finally {
      this.COMMON_SET_FETCHING({ label: 'isFetching', value: false });
    }
  }

  @Action
  public setShowCollums(collums: [string]) {
    this.SET_IS_SHOW_TABLE(false);
    this.COMMON_SET_FETCHING({ label: 'isFetching', value: true });
    this.SET_SHOW_COLLUMS(collums);
    this.SET_IS_SHOW_TABLE(true);
  }

  @Action
  public setViews(name: string) {
    this.SET_IS_SHOW_TABLE(false);
    this.COMMON_SET_FETCHING({ label: 'isFetching', value: true });
    this.SET_SHOW_COLLUMS(this.dataForAllWindows[this.key as number].views[name]);
    this.SET_SELECTED_VIEWS_NAME(name);
    // this.SET_IS_SHOW_TABLE(true)
  }

  @Action
  public setViewsName(name: string) {
    this.SET_IS_SHOW_TABLE(false);
    this.COMMON_SET_FETCHING({ label: 'isFetching', value: true });
    this.SET_SELECTED_VIEWS_NAME(name);
    // this.SET_IS_SHOW_TABLE(true)
  }

  @Action
  public async getTableDataType(payload: {
    databaseName: string;
    DatasetName: string;
  }): Promise<void> {
    this.COMMON_SET_FETCHING({ label: 'isTablesDataTypeFetching', value: true });
    try {
      const response = await QueryBuilderService.getTableDataType(payload);
      if (response.data.length) {
        await this.getTableValues(response.data[0].DataType);
      }
      SaveSettingModule.setDType({ key: this.key as number, data: response.data[0].DataType });
    } catch (e: any) {
      ErrorsModule.showErrorMessage(e.message);
    } finally {
      this.COMMON_SET_FETCHING({ label: 'isTablesDataTypeFetching', value: false });
    }
  }

  @Action({ rawError: true })
  public async getDBAlias(key: number): Promise<void> {
    this.SET_KEY_FOR_WINDOW(key);
    this.COMMON_SET_FETCHING({ label: 'isDBAliasFetching', value: true });
    try {
      const response = await RTCServiceObj.uploadDBAlias();
      console.log('db-1', response);
      console.log('db-key', key);
      this.SET_DB_ALIAS_ITEMS(response.DBAlias);
      this.SET_DB_ENGINE_ITEMS(response.DBEngine);
      // if (response.DBAlias && response.DBAlias.length > 0) {
      //   this.SET_DATA_BASE_CURRENT_ALIAS(response.DBAlias[0]);
      // }
    } catch (e: any) {
      ErrorsModule.showErrorMessage(e.message);
    } finally {
      this.COMMON_SET_FETCHING({ label: 'isDBAliasFetching', value: true });
    }
  }

  // new actions
  @Mutation
  private INIT_STATE_FOR_ONE_WINDOW() {
    this.dataForAllWindows[this.key as number] = defaultInitState();
  }

  @Mutation
  private SET_KEY_FOR_WINDOW(key: number) {
    this.key = key;
  }

  @Action
  public initStateForWindow(key: number) {
    this.SET_KEY_FOR_WINDOW(key);
    this.INIT_STATE_FOR_ONE_WINDOW();
  }
  @Action
  public setIsSending(value: boolean) {
    this.IS_SENDING(value);
  }
  @Mutation
  private IS_SENDING(value: boolean) {
    this.dataForAllWindows = {
      ...this.dataForAllWindows,
      [this.key as number]: {
        ...this.dataForAllWindows[this.key as number],
        isSending: value,
      },
    };
  }
}

export const QueryBuilderModule = getModule(QueryBuilder);
