export interface InfoSmmListResponseItem {
  Name: string;
  Type: string;
  LastModifiedDate: string;
  LastModifiedUser: string;
  Description: string;
  Version: number;
  Tier: string;
  Policies: Array<any>;
  DataType: string;
}

export enum logicalOperatorType {
  OR = 'OR',
  AND = 'AND',
}

export enum childrenType {
  group = 'query-builder-group',
  rule = 'query-builder-rule',
}

export interface QueryBuilderRule {
  type: childrenType;
  query: {
    rule: string;
    operator: string;
    operand: string;
    value: string | null;
  };
}

export interface QueryBuilderGroup {
  type: childrenType;
  query: {
    logicalOperator: logicalOperatorType;
    children: Array<QueryBuilderGroup & QueryBuilderRule>;
  };
}

export interface MainQuery {
  logicalOperator: logicalOperatorType;
  children: Array<QueryBuilderGroup & QueryBuilderRule>;
}
