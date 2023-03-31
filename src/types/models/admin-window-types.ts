export interface adminItem {
  fullName: string;
  login: string;
  origin: string;
  Email: string;
  lastVisited: string;
  groups: string;
}

enum responseType {
  USER = 'UserAWS',
  GROUP = 'GroupAWS',
  POLICY = 'PolicyAWS',
}

export interface userResponse {
  Arn: string;
  IAM: string;
  IAMGroups: string[];
  IAMPolicies?: string[];
  Name: string;
  Path: string;
  Policies: {
    GroupAttached: string[];
    GroupInline: string[];
    UserAttached: string[];
    UserInline: string[];
  };
  Type: responseType;
}

export interface userResponseModified {
  Arn: string;
  IAM: string;
  IAMGroups: string;
  IAMPolicies?: string;
  Name: string;
  Path: string;
  Policies: {
    GroupAttached: string;
    GroupInline: string;
    UserAttached: string;
    UserInline: string;
  };
  Type: responseType;
}

export interface userResponseModifiedForUpdate {
  Arn: string;
  IAM: string;
  IAMGroups: string[];
  IAMPolicies?: string[];
  Name: string;
  Path: string;
  Policies: {
    GroupAttached: string;
    GroupInline: string;
    UserAttached: string;
    UserInline: string;
  };
  Type: responseType;
}

export interface payloadForUpdate {
  Name: string;
  type: string;
  IAMGroups: string[];
  IAMPolicies: string[];
}

export interface groupResponse {
  Arn: string;
  GroupId: string;
  Name: string;
  Path: string;
  Policies: {
    GroupAttached: string[];
    GroupInline: string[];
  };
  Type: responseType;
}

export interface policiesResponse {
  Arn: string;
  LatestVersion: {
    CreateDate: string;
    Document: string;
    IsDefaultVersion: boolean;
    VersionId: string;
  };
  Name: string;
  Path: string;
  PolicyId: string;
  Type: responseType;
}

export interface PermissionsTypes {
  Admin: boolean;
  LisaPowerUsers: boolean;
  LisaUsers: boolean;
  UserName: string;
}

export interface IPolicies {
  GroupAttached: string;
  GroupInline: string;
}

export interface IPoliciesGroup {
  PolicyName: string;
  PolicyDocument: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface platformResponse {}
