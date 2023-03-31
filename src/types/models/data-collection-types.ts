export interface InputContent {
  label: string;
  content: string;
  hint: string;
}

export interface JobConfigType {
  S3Folders: string;
  S3EnumerationDepth: string;
  DataType: string;
  QueryString: string;
  LogVolume: string;
  AllocationStrategy: string;
  PreferedWorkerNumber: string;
  DatabaseParameters: string;
  DatasetName: string;
  DatasetDescription: string;
  DatasetOwners: Array<string>;
  DatasetAccess: Array<string>;
}
export interface S3PropertiesType {
  S3Folders: string;
  S3EnumerationDepth: string;
  S3SelectParameter: {
    Compression: string;
    JsonType: string;
  };
}

export interface JobConfigResponseType {
  JOBQueueURL: string;
  S3Properties: S3PropertiesType;
  QueryString: string;
  Schema: string;
  DatabaseParameters: string;
  TableParameters: string;
  ComputeEnvironment: {
    EnvironmentSize: string;
    AllocationStrategy: string;
    PreferedWorkerNumber: string;
  };
  DataType: string;
}

export interface getTablesItemsType {
  Name: string;
  Type: string;
}

export interface BucketType {
  BucketName: string;
  Region: string;
  Geography: string;
}

export interface PathType {
  [k: string]: string | PathType;
}

export interface SettingType {
  Access: string[];
  DataType: string;
  DatabaseName: string;
  Owners: string[];
  QueryName: string;
  QuerySettings: {
    ComputeEnvironment: string;
    Description: string;
    QueryString: string;
    S3Folders: string;
  };
  QueryType: string;
  TableName: string;
  UnixTime: number;
  UsersQuery: string;
}
