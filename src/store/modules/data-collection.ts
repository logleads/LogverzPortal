/* eslint-disable no-console */
import { merge } from 'lodash';
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';

import { notShowDatatypeSelector } from '~/constants';
import { DataCollectionService } from '~/services/api/data-collection-service';
import { store } from '~/store';
import { AdminModule } from '~/store/modules/admin';
import { ErrorsModule } from '~/store/modules/errors';
import { JobConfigType, SettingType } from '~/types/models/data-collection-types';
import { QueryBuilderLabels, QueryBuilderRule } from '~/types/models/query-builder-types';
import { nthOccurrence } from '~/utils/nth-occurence';
import { parseDBAlias } from '~/utils/parseDBAlias';
import { parseParametersList } from '~/utils/parseParametersList';
import {
  createAzureFolders,
  createS3Folders,
  getMaxId,
  mergeTreeByFullPath,
  transformObjToS3Folder,
  updateTreeNodeData,
} from '~/utils/S3treelist';
interface FolderData {
  ID: number;
  IDH: number;
  StorageAccount: string;
  ContainerName: string;
  Location: string;
  data: any;
}

@Module({
  dynamic: true,
  name: 'data-collection',
  store,
})
class DataCollection extends VuexModule {
  isFetching = false;
  isFetchingTableParameters = false;
  isFetchSettingsParams = false;
  isBucketsFetching = false;
  allocationStrategy = 'cost-sensitive';
  DataType = 'schemas';
  DatasetWarning = '';
  DatasetName = '';
  databaseParameters = 'DefaultDB';
  DatasetDescription = 'The settings used to create the data in the data set';
  s3EnumerationDepth = '2';
  preferedWorkerNumber = 'auto';
  s3Folders = 's3://';
  blobFolders = 'blob://';

  logVolume = 'small';
  pathObj: unknown = {};
  isLoadConfigurationUpload: boolean = false;
  rootsForJSON: any = '';
  castForParameters: any = [];

  databaseParamItems: Array<string> = [];

  query: unknown = {
    children: [],
  };

  DatasetOwners: Array<{ name: string }> = [];

  rules: Array<QueryBuilderRule> = [
    {
      type: 'text',
      id: 'SetDataTypePlease',
      label: 'SetDataTypePlease',
    },
  ];

  labels: QueryBuilderLabels = {
    matchType: 'Match Type',
    matchTypes: [
      { id: 'AND', label: 'And' },
      { id: 'OR', label: 'Or' },
    ],
    addRule: 'Add Rule',
    removeRule: null,
    addGroup: 'Add Group',
    removeGroup: null,
    textInputPlaceholder: 'value',
  };

  tableOptions: Array<{ name: string }> = [];

  queryTypesItems: Array<string> = ['schemas', 'trail'];

  DatasetAccess: Array<{ name: string }> = [];

  queryString = 'select * from  Where errorMessage!=\u0027null\u0027';

  isCustomRules = false;
  jobCreated = false;
  isCreatingConnection = false;
  tableTypes: { [key: string]: string } = {};
  csvHeader: string = '';
  buckets: Array<string> = [];
  currentBucket = '';
  rootFolderFetching = false;

  subFoldersFetch: Array<{ path: string; fetching: boolean }> = [{ path: 's://', fetching: false }];
  expandedPath: Array<string> = [];
  savedSettings: SettingType[] = [];
  isSettingsFetch = false;
  listFolder: any = [];
  listAzureFolder: any = [];

  listLoader: boolean = false;
  listAzureLoader: boolean = false;

  sampleData: string = '';
  dataSets3Select: { [key: string]: any } = {};
  @Mutation
  private SET_SAMPLE_DATA(v: string) {
    this.sampleData = v;
  }

  @Mutation
  private SET_LIST_FOLDER(v: any) {
    this.listFolder = v;
  }
  @Mutation
  private SET_LIST_FOLDER_Azure(v: any) {
    this.listAzureFolder = v;
  }

  @Mutation
  private SET_LIST_LOADER(v: boolean) {
    this.listLoader = v;
  }
  @Mutation
  private SET_LIST_AZURE_LOADER(v: boolean) {
    this.listAzureLoader = v;
  }

  @Mutation
  private SET_BUCKET_FETCH_STATUS(value: boolean) {
    this.isBucketsFetching = value;
  }
  @Mutation
  private SET_CAST_FOR_PARAMETERS(value: any) {
    // console.log('SET_ROOTS_FOR_JSON', value);
    this.castForParameters = value;
  }
  @Mutation
  private SET_ROOTS_FOR_JSON(value: any) {
    // console.log('SET_ROOTS_FOR_JSON', value);
    this.rootsForJSON = value;
  }

  @Mutation
  private SET_LOAD_CONFIGURATION(value: boolean) {
    this.isLoadConfigurationUpload = value;
  }

  @Mutation
  private SET_IS_SETTINGS_FETCH(status: boolean) {
    this.isSettingsFetch = status;
  }

  @Mutation
  private SET_SAVED_SETTINGS(value: SettingType[]) {
    this.savedSettings = value;
  }

  @Mutation
  private ADD_EXPANDED(value: string) {
    if (!this.expandedPath.includes(value)) {
      this.expandedPath.push(value);
    }
  }

  @Mutation
  private DELETE_EXPANDED(value: string) {
    this.expandedPath = this.expandedPath.filter(i => i !== value);
  }

  @Mutation
  private SET_ROOT_FOLDER_STATUS(value: boolean) {
    this.rootFolderFetching = value;
  }

  @Mutation
  private SET_SUB_FOLDER_FETCH(payload: { path: string; fetching: boolean }) {
    this.subFoldersFetch = [
      ...this.subFoldersFetch.filter((item: any) => item.path !== payload.path),
      payload,
    ];
  }

  @Mutation
  private SET_S3_FOLDERS(payload: { value: string; expanded: boolean; deep: number }): void {
    if (this.s3Folders.includes('s3://')) {
      if (this.s3Folders[this.s3Folders.length - 1] === '/') {
        this.s3Folders = this.s3Folders + payload.value;
      } else {
        const end =
          nthOccurrence(this.s3Folders, '/', payload.deep) === -1
            ? this.s3Folders.length
            : nthOccurrence(this.s3Folders, '/', payload.deep);
        this.s3Folders = this.s3Folders.slice(0, end) + '/' + payload.value;
      }
    } else {
      this.s3Folders = 's3://' + payload.value;
    }
  }
  private SET_BLOB_FOLDERS(payload: { value: string; expanded: boolean; deep: number }): void {
    if (this.blobFolders.includes('blob://')) {
      if (this.blobFolders[this.blobFolders.length - 1] === '/') {
        this.blobFolders = this.blobFolders + payload.value;
      } else {
        const end =
          nthOccurrence(this.blobFolders, '/', payload.deep) === -1
            ? this.blobFolders.length
            : nthOccurrence(this.blobFolders, '/', payload.deep);
        this.blobFolders = this.blobFolders.slice(0, end) + '/' + payload.value;
      }
    } else {
      this.blobFolders = 'blob://' + payload.value;
    }
  }
  @Mutation
  private SET_S3_FOLDERS_SIMPLE(payload: string[]): void {
    if (payload.length > 0)
      this.s3Folders = payload.reduce((acc: string, item) => {
        return (acc + 's3://' + item + ';').length < 2000 ? acc + 's3://' + item + ';' : acc;
      }, '');
    else this.s3Folders = 's3://';
  }
  @Mutation
  private SET_BLOB_FOLDERS_SIMPLE(payload: string[]): void {
    if (payload.length > 0)
      this.s3Folders = payload.reduce((acc: string, item) => {
        return (acc + 'blob://' + item + ';').length < 2000 ? acc + 'blob://' + item + ';' : acc;
      }, '');
    else this.s3Folders = 'blob://';
  }

  @Mutation
  private SET_BUCKETS(value: Array<string>) {
    this.buckets = value;
  }

  @Mutation
  private SET_CUSTOM_RULES(value: boolean): void {
    this.isCustomRules = value;
  }

  @Mutation
  private SET_DATA_SET_S3_SELECT(value: { [key: string]: string }): void {
    // console.log('S# select', value);
    this.dataSets3Select = value;
  }
  @Mutation
  private SET_TABLE_TYPE(value: { [key: string]: string }): void {
    this.tableTypes = value;
  }
  @Mutation
  private SET_CSV_HEADER_INFO(value: string): void {
    // console.log('SET_CSV_HEADER_INFO', value);
    this.csvHeader = value;
  }

  @Mutation
  private SET_CONNECTING_STATUS(value: boolean): void {
    this.isCreatingConnection = value;
  }

  @Mutation
  private SET_JOB_CREATED(value: boolean): void {
    this.jobCreated = value;
  }

  @Mutation
  private SET_PATH(value: unknown): void {
    this.pathObj = merge(this.pathObj, value);
  }

  @Mutation
  private SET_SELECT_VALUE(payload: { label: string; value: string }): void {
    switch (payload.label) {
      case 'LogVolume':
        this.logVolume = payload.value;
        break;
      case 'AllocationStrategy':
        this.allocationStrategy = payload.value;
        break;
      case 'DatatypeSelector':
        this.DataType = payload.value;
        break;
      case 'DBServerAlias':
        this.databaseParameters = payload.value;
        break;
      case 'CurrentBucket':
        this.currentBucket = payload.value;
        break;
    }
  }

  @Mutation
  private SET_MULTI_SELECT(payload: { label: string; value: Array<{ name: string }> }): void {
    switch (payload.label) {
      case 'DatasetAccess':
        this.DatasetAccess = payload.value;
        break;
      case 'DatasetOwners':
        this.DatasetOwners = payload.value;
        break;
    }
  }

  @Mutation
  private HARD_SET_S3_FOLDERS(value: string) {
    this.s3Folders = value;
  }

  @Mutation
  private HARD_SET_TABLE_DESCRIPRION(value: string) {
    this.DatasetDescription = value;
  }

  @Mutation
  private SET_INPUT_VALUE(payload: { label: string; value: string }): void {
    switch (payload.label) {
      case 'DatasetName':
        this.DatasetName = payload.value;
        this.queryString = ` SELECT * FROM ${payload.value ? payload.value + ' AS tbl' : ''}`;

        break;
      case 'DatasetDescription':
        this.DatasetDescription = payload.value;
        break;
      case 'S3EnumerationDepth':
        this.s3EnumerationDepth = payload.value;
        break;
      case 'PreferedWorkerNumber':
        this.preferedWorkerNumber = payload.value;
        break;
      case 'S3Folders':
        this.s3Folders = payload.value;
        break;
      case 'QueryString':
        this.queryString = payload.value;
        break;
      case 'DatatypeSelector':
        this.DataType = payload.value;
        break;
      case 'DatasetWarning':
        this.DatasetWarning = payload.value;
        break;
    }
  }

  @Mutation
  private SET_QUERY_TYPE_ITEMS(items: Array<string>): void {
    this.queryTypesItems = items;
    this.DataType = items
      .filter(item => !notShowDatatypeSelector.includes(item))
      .reduce((acc: string[], i: string) => {
        if (i?.toLowerCase().includes('set')) {
          return [i, ...acc];
        } else {
          return [...acc, i];
        }
      }, [])[0];
  }

  @Mutation
  private SET_RULES(rules: Array<QueryBuilderRule>) {
    this.rules = rules;
  }

  @Mutation
  private SET_TABLE_ITEMS(items: Array<{ name: string }>): void {
    this.tableOptions = [...this.tableOptions, ...items];
  }

  @Mutation
  private SET_DB_ALIAS_ITEMS(items: Array<string>): void {
    this.databaseParamItems = items;
  }

  @Mutation
  private SET_QUERY(value: unknown) {
    this.query = value;
  }

  @Mutation
  private SET_IS_FETCHING(value: boolean): void {
    this.isFetching = value;
  }

  @Mutation
  private SET_IS_FETCHING_TABLE_PARAMETERS(value: boolean): void {
    this.isFetchingTableParameters = value;
  }

  @Mutation
  private SET_IS_FETCH_SETTINGS_PARAMS(value: boolean): void {
    this.isFetchSettingsParams = value;
  }

  @Action
  public setIsCustomRules(value: boolean): void {
    this.SET_CUSTOM_RULES(value);
  }

  @Action
  public setMultiSelect(payload: { label: string; value: Array<{ name: string }> }): void {
    this.SET_MULTI_SELECT(payload);
  }

  @Action
  public setInputValue(payload: { label: string; value: string }): void {
    console.log(payload);
    
    this.SET_INPUT_VALUE(payload);
  }

  @Action
  public setSelectValue(payload: { label: string; value: string }): void {
    this.SET_SELECT_VALUE(payload);
  }

  @Action
  public setFoldersPath(
    payload: { value: string; expanded: boolean; deep: number },
    activeSettings: { aws: boolean; azure: boolean },
  ): void {
    if (activeSettings.aws) {
      this.SET_S3_FOLDERS(payload);
    } else {
      this.SET_BLOB_FOLDERS(payload);
    }
  }
  @Action
  public setFoldersPathHard(payload: string[]): void {
    this.SET_S3_FOLDERS_SIMPLE(payload);
  }

  @Action
  public setBlobFoldersPathHard(payload: string[]): void {
    this.SET_BLOB_FOLDERS_SIMPLE(payload);
  }

  @Action
  public async startJob(body: JobConfigType) {
    this.SET_IS_FETCHING(true);
    try {
      const response = await DataCollectionService.startJob(body);
      if (response.status === 200) {
        this.SET_JOB_CREATED(true);
      }
    } catch (e: any) {
      ErrorsModule.showErrorMessage(e.message);
    } finally {
      this.SET_IS_FETCHING(false);
    }
  }

  // @Action
  // public async getTableType(schema: string) {
  //   this.SET_IS_FETCH_SETTINGS_PARAMS(true);
  //   try {
  //     // const response = await DataCollectionService.getTypeOfTable();
  //     // const data = JSON.parse(response.data.Parameter.Value);
  //     const tableTypes: { [key: string]: string } = {};
  //     const rootsForJSON: { [key: string]: string } = {};
  //     // Object.keys(data).forEach(i => {
  //     //     tableTypes[i] = data[i].InputSerialization.CSV ? 'CSV' : 'JSON';
  //     //     rootsForJSON[i] = data[i].InputSerialization.RootElement;
  //     //   });

  //     tableTypes[schema] = this.dataSets3Select.InputSerialization.CSV ? 'CSV' : 'JSON';
  //     rootsForJSON[schema] = this.dataSets3Select.InputSerialization.RootElement;
  //     this.SET_TABLE_TYPE(tableTypes);
  //     this.SET_ROOTS_FOR_JSON(rootsForJSON);
  //   } catch (e: any) {
  //     ErrorsModule.showErrorMessage(e.message);
  //   } finally {
  //     this.SET_IS_FETCH_SETTINGS_PARAMS(false);
  //   }
  // }

  @Action
  public initStartJob() {
    this.SET_JOB_CREATED(false);
  }

  @Action
  public startConnection() {
    this.SET_CONNECTING_STATUS(true);
  }

  @Action
  public async getQueryType() {
    this.SET_IS_FETCH_SETTINGS_PARAMS(true);
    try {
      const response = await DataCollectionService.getDatatypeSelector();
      const queryTypes = response.data
        .map((item: any) => item.Name.split('/'))
        .map((item: any) => item[item.length - 1]);
      this.SET_QUERY_TYPE_ITEMS(queryTypes);
      this.SET_INPUT_VALUE({
        value: `SELECT * FROM ${this.DatasetName ? this.DatasetName + ' AS tbl' : ''}`,
        label: 'QueryString',
      });
    } catch (e: any) {
      ErrorsModule.showErrorMessage(e.message);
    } finally {
      this.SET_IS_FETCH_SETTINGS_PARAMS(false);
    }
  }

  @Action
  public setQuery(value: unknown): void {
    this.SET_QUERY(value);
  }

  @Action
  public async getDatasetAccessParameters(): Promise<void> {
    this.SET_IS_FETCH_SETTINGS_PARAMS(true);
    try {
      const IAMUsersResponse = await DataCollectionService.getDatasetAccessItems(true);

      const groupsResponse = await DataCollectionService.getDatasetAccessGroupItems();

      this.SET_TABLE_ITEMS(
        IAMUsersResponse.data?.map((item: any) => ({
          name: item.Name + ':' + item.Type,
        })),
      );
      this.SET_TABLE_ITEMS(
        groupsResponse.data?.map((item: any) => ({
          name: item.Name + ':' + item.Type,
        })),
      );
    } catch (e: any) {
      ErrorsModule.showErrorMessage(e.message);
    } finally {
      this.SET_IS_FETCH_SETTINGS_PARAMS(false);
    }
  }

  @Action
  public async getTableParametersList(schema: string): Promise<void> {
    this.SET_IS_FETCHING_TABLE_PARAMETERS(true);
    try {
      let tableTypes: any = {};
      let rootsForJSON: any = {};
      let CSVFileHeader: string = '';
      // console.log('console coming here ', schema);
      const response = await DataCollectionService.getTableKeys(schema);
      this.getSampleData(schema);
      try {
        console.log(response.data.Parameter?.Value);

        const { StgSelectParameters } = JSON.parse(response.data.Parameter?.Value);
        // console.log(StgSelectParameters, 'StgSelectParameters');
        this.SET_DATA_SET_S3_SELECT(StgSelectParameters ? StgSelectParameters.IO : {});
        tableTypes = { [schema]: StgSelectParameters.IO.InputSerialization.CSV ? 'CSV' : 'JSON' };
        rootsForJSON = { [schema]: StgSelectParameters.IO.InputSerialization.RootElement };
        if (StgSelectParameters.IO.InputSerialization.CSV) {
          CSVFileHeader = StgSelectParameters.IO.InputSerialization.CSV.FileHeaderInfo;
        }
        console.log('this.tableTypes = ', tableTypes);
        console.log('this.rootsForJSON = ', rootsForJSON);
        console.log('this.DataType = ', schema);
        this.SET_INPUT_VALUE({
          value: `SELECT * FROM ${this.DatasetName ? this.DatasetName + ' AS tbl' : ''}`,
          label: 'QueryString',
        });
        if (StgSelectParameters.Cast) {
          this.SET_CAST_FOR_PARAMETERS(StgSelectParameters.Cast);
        }
        this.SET_ROOTS_FOR_JSON(rootsForJSON);
        this.SET_TABLE_TYPE(tableTypes);
        this.SET_CSV_HEADER_INFO(CSVFileHeader);
      } catch (error) {
        console.log('there is an error', error);
      }
      // console.log('rules', parseParametersList(response.data.Parameter.Value));
      this.SET_RULES(parseParametersList(response.data.Parameter.Value));
    } catch (e: any) {
      ErrorsModule.showErrorMessage(e.message);
    } finally {
      this.SET_IS_FETCHING_TABLE_PARAMETERS(false);
    }
  }

  @Action
  public async getPath(path: string): Promise<void> {
    this.SET_SUB_FOLDER_FETCH({ path, fetching: true });
    try {
      const response = await DataCollectionService.getPath(path);
      this.SET_PATH(response.data);
    } catch (e: any) {
      ErrorsModule.showErrorMessage(e.message);
    } finally {
      this.SET_SUB_FOLDER_FETCH({ path, fetching: false });
    }
  }

  @Action
  public async getDBAlias(): Promise<void> {
    this.SET_IS_FETCH_SETTINGS_PARAMS(true);
    try {
      const response = await DataCollectionService.getDBAlias();
      this.SET_DB_ALIAS_ITEMS(parseDBAlias(response.data.Parameter.Value));
    } catch (e: any) {
      ErrorsModule.showErrorMessage(e.message);
    } finally {
      this.SET_IS_FETCH_SETTINGS_PARAMS(false);
    }
  }

  @Action
  public async getBuckets(): Promise<void> {
    this.SET_BUCKET_FETCH_STATUS(true);
    try {
      const response = await DataCollectionService.getBuckets();
      const buckets = response.data?.map(i => i.BucketName);
      this.SET_SELECT_VALUE({ label: 'CurrentBucket', value: buckets[0] });
      this.SET_BUCKETS(buckets);
    } catch (e: any) {
      ErrorsModule.showErrorMessage(e.message);
    } finally {
      this.SET_BUCKET_FETCH_STATUS(false);
    }
  }

  @Action
  public rootFolderFetch(value: boolean) {
    this.SET_ROOT_FOLDER_STATUS(value);
  }

  @Action
  public setExpanded(payload: { value: string; delete: boolean }) {
    if (payload.delete) {
      this.DELETE_EXPANDED(payload.value);
    } else {
      this.ADD_EXPANDED(payload.value);
    }
  }

  @Action
  public async getSettings({ typeQuery, unixTime }: { typeQuery: boolean; unixTime: number }) {
    this.SET_IS_SETTINGS_FETCH(true);
    try {
      const data = await DataCollectionService.getSettings(
        AdminModule.permissions.UserName,
        typeQuery,
        unixTime,
      );
      this.SET_SAVED_SETTINGS(data);
    } catch (e: any) {
      ErrorsModule.showErrorMessage(e.message);
    } finally {
      this.SET_IS_SETTINGS_FETCH(false);
    }
  }

  @Action
  public async getSettingsSortByTime({
    unixTime,
    typeQuery,
  }: {
    unixTime: number;
    typeQuery: boolean;
  }) {
    this.SET_IS_SETTINGS_FETCH(true);
    try {
      const data = await DataCollectionService.getSettingsSortByTime(
        AdminModule.permissions.UserName,
        unixTime,
        typeQuery,
      );
      this.SET_SAVED_SETTINGS(data);
    } catch (e: any) {
      ErrorsModule.showErrorMessage(e.message);
    } finally {
      this.SET_IS_SETTINGS_FETCH(false);
    }
  }

  @Action
  public async getListFolders() {
    let dataArray = null;
    try {
      this.SET_LIST_LOADER(true);
      const listFolder = (await DataCollectionService.getBuckets()).data;

      // const filteredListFolder = listFolder.filter(obj => Object.keys(obj).length !== 0);
      const filteredListFolder = listFolder
        ? listFolder.filter(obj => Object.keys(obj).length > 0)
        : [];

      const data = (
        await DataCollectionService.getListFolders(
          filteredListFolder.map((item: any) => item.BucketName),
        )
      )
        .filter(it => it.status === 'fulfilled')
        .map((item: any) => {
          return item.value.data;
        });
      const newListFolder = data?.map((item: any) => {
        return filteredListFolder.filter((it: any) => it.BucketName === Object.keys(item)[0])[0];
      });
      dataArray = createS3Folders(data, newListFolder, 0);

      this.SET_LIST_FOLDER(dataArray);
      this.SET_LIST_LOADER(false);
    } catch (e: any) {
      ErrorsModule.showErrorMessage(e.message);
    } finally {
    }
  }
  @Action
  public async getAzureListFolders() {
    this.SET_LIST_AZURE_LOADER(true);

    try {
      const data = (await DataCollectionService.getBucketsAzure()).data; // Fetch the data
      const idCounterObj = { count: 1 };

      const azureTreeData = createAzureFolders(data, 0, null, '', idCounterObj);
      this.SET_LIST_FOLDER_Azure(azureTreeData);
      this.SET_LIST_AZURE_LOADER(false);

      return azureTreeData;
     
    } catch (e: any) {
      ErrorsModule.showErrorMessage(e.message); // Handle errors if any
    } finally {
      // this.SET_LIST_LOADER(false); // Hide loader when done
    }
  }

  @Action
  public async updateListFolders(data: { newRow: any; oldRow: any }) {
    this.SET_IS_SETTINGS_FETCH(true);
    try {
      const searchChildreByID = this.listFolder.filter((item: any) => item.IDH === data.oldRow.ID);
      const arrayKeys = data.oldRow.value.split('/');

      const datas = data.newRow.map((item: any) => {
        return arrayKeys.reduce((acc: any, it: string) => {
          return acc[it];
        }, item);
      });

      const sortingArray = searchChildreByID.map((item: any) => {
        const temp = datas.filter(it => Object.keys(it).includes(item.name));

        return {
          father: item,
          children: temp.pop(),
        };
      });

      const gg = sortingArray
        .filter((i: any) => i)
        .map((item: any) => transformObjToS3Folder(item))
        .reduce((acc: any, it: any) => {
          return [...acc, ...it];
        }, []);
      if (gg.length) {
        this.SET_LIST_FOLDER([...gg, ...this.listFolder]);
      }
    } catch (e: any) {
      ErrorsModule.showErrorMessage(e.message);
    } finally {
      this.SET_IS_SETTINGS_FETCH(false);
    }
  }

  @Action
  public async updateAzureListFolders(data: { newRow: any; oldRow: any }) {
    this.SET_IS_SETTINGS_FETCH(true);
    try {
      let updatedTree = [...this.listAzureFolder];

      // 1. Prepare ID counter to keep IDs unique
      const idCounterObj = { count: getMaxId(updatedTree) + 1 };
      const dotPath = data.oldRow.fullPath.split('/').join('.');

      function getNestedValue(obj: any, path: string): any {
        return path
          .split('.')
          .reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
      }
      const value = getNestedValue(data.newRow, dotPath);

      if (!value) {
        console.warn('No nested data found for ContainerName or StorageAccount');
        return;
      }
      console.log("dotPath?.split('.')[0]", dotPath?.split('.')[0]);

      // 3. Generate new folders (only children from backend)
      const generatedChildren = createAzureFolders(
        value,
        data.oldRow.ID,
        dotPath?.split('.')[0],
        data.oldRow?.fullPath || '',
        idCounterObj,
        data.newRow['stgaccproperties'],
      );

      const mergedChildren = mergeTreeByFullPath(data.oldRow.data, generatedChildren);

      // 5. Now update tree with updated children of oldRow
      updatedTree = updateTreeNodeData(updatedTree, data.oldRow.ID, mergedChildren);

      this.SET_LIST_FOLDER_Azure(updatedTree);
    } catch (e: any) {
      ErrorsModule.showErrorMessage(e.message);
    } finally {
      this.SET_IS_SETTINGS_FETCH(false);
    }
  }
  @Action
  public loadConfiguration(data: {
    S3Folders: string;
    DatabaseName: string;
    DataType: string;
    QueryString: string;
    DatasetName: string;
    Description: string;
    UsersQuery: string;
    Owners: string;
    Access: string;
    DatasetWarnings: string;
    // TableName: string;
  }) {
    console.log('data: ', data);

    this.HARD_SET_S3_FOLDERS(data.S3Folders);
    this.HARD_SET_TABLE_DESCRIPRION(data.Description);
    // console.log('GRAB DATA', data);
    this.SET_INPUT_VALUE({
      value: data.DatasetWarnings,
      label: 'DatasetWarning',
    });
    this.SET_INPUT_VALUE({
      value: data.DatasetName,
      label: 'DatasetName',
    });
    this.SET_INPUT_VALUE({
      value: data.QueryString,
      label: 'QueryString',
    });
    this.SET_INPUT_VALUE({
      value: data.DatabaseName,
      label: 'DBServerAlias',
    });
    this.SET_INPUT_VALUE({
      value: data.DataType,
      label: 'DatatypeSelector',
    });

    //data.UsersQuery was using here before changes [{ name: data.UsersQuery }]
    const dataOwners = data.Owners?.split(' ').map(i => {
      return { name: i };
    });
    this.SET_MULTI_SELECT({
      label: 'DatasetOwners',
      value: dataOwners,
    });
    const DatasetAccess = data.Access?.split(' ').map(i => {
      return { name: i };
    });
    this.SET_MULTI_SELECT({
      label: 'DatasetAccess',
      value: DatasetAccess,
    });

    this.SET_LOAD_CONFIGURATION(true);
  }

  @Action
  public async getSampleData(schema: string): Promise<void> {
    try {
      const data = await DataCollectionService.getSameData(schema);
      // console.log(data, 'getSameData');
      this.SET_SAMPLE_DATA(data);
    } catch (e: any) {
      ErrorsModule.showErrorMessage(e.message);
    }
  }
}
export const DataCollectionModule = getModule(DataCollection);
