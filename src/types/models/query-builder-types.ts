export interface ParameterList {
  Parameter: {
    ARN: string;
    DataType: string;
    LastModifiedDate: string;
    Name: string;
    Type: string;
    Value: string;
    Version: number;
  };
}
export interface ParametersType {
  Name: string;
  WithDecryption: boolean;
}
export interface DescribeParametersType {
  ParameterFilters: Array<{ Key: string; Option: string; Values: Array<string> }>;
}

export interface QueryBuilderLabels {
  matchType: string;
  matchTypes: Array<{ id: string; label: string }>;
  addRule: string;
  removeRule: string | null;
  addGroup: string | null;
  removeGroup: string | null;
  textInputPlaceholder: string;
}

export interface QueryBuilderRule {
  type: string;
  id: string;
  label: string;
  choices?: Array<{ label: string; value: string }>;
}

export interface ConfigType {
  credential: string;
  urls: string;
  username: string;
}

export interface IdentitiesQueryParameters {
  AttributeName: string;
  AttributeValue: string;
  Expression: string;
}

export enum DataType {
  CLOUD_TRAIL = 'CloudTrail',
  VPC_FLOW = 'VPCFlow',
}

export interface IdentitiesQueryResponse {
  Access: Array<string>;
  DataType: DataType;
  DatabaseName: string;
  Owners: Array<string>;
  QueryName: string;
  QuerySettings: {
    Any: string;
    Description: string;
    Off: string;
    Properties: string;
    Recorded: string;
  };
  QueryType: string;
  TableName: string;
  UnixTime: number;
  UsersQuery: string;
}

export interface CloudTrailDataResponse {
  additionalEventData: string;
  awsRegion: string;
  createdAt: string;
  errorCode: string;
  errorMessage: string;
  eventID: string;
  eventName: string;
  eventSource: string;
  eventTime: string;
  eventType: string;
  eventVersion: string;
  id: number;
  readOnly: string;
  recipientAccountId: string;
  requestID: string;
  requestParameters: {
    maxResults: number;
    serviceId: string;
  };
  resources: string;
  responseElements: string;
  serviceEventDetails: string;
  sourceIPAddress: string;
  updatedAt: string;
  userAgent: string;
  userIdentity: {
    accessKeyId: string;
    accountId: string;
    arn: string;
    invokedBy: string;
    principalId: string;
    sessionContext: {
      attributes: {
        creationDate: string;
        mfaAuthenticated: string;
      };
      sessionIssuer: {
        accountId: string;
        arn: string;
        principalId: string;
        type: string;
        userName: string;
      };
      webIdFederationData: Record<string, never>;
    };
    type: string;
  };
  vpcEndpointId: string;
}
