import {
  childrenType,
  logicalOperatorType,
  MainQuery,
  QueryBuilderGroup,
  QueryBuilderRule,
} from '~/types/common';

interface parsedRuleType {
  [k: string]: { [k: string]: string | null };
}
interface parsedGroupType {
  [k: string]: Array<parsedRuleType | parsedGroupType>;
}

const getOperator = (operator: string, value: string): [string, string | null] => {
  switch (operator) {
    case 'equals':
      return ['<eq>', value];
    case 'does not equal':
      return ['<ne>', value];
    case 'contains':
      return ['<like>', `%${value}`];
    case 'does not contain':
      return ['<notLike>', `%${value}`];
    case 'is empty':
      return ['<is>', null];
    case 'is not empty':
      return ['<not>', null];
    case 'begins with':
      return ['<startsWith>', value];
    case 'ends with':
      return ['<endsWith>', value];
    default:
      return ['', value];
  }
};

const logicalOperator = (operator: logicalOperatorType): string => {
  switch (operator) {
    case logicalOperatorType.AND:
      return '<and>';
    case logicalOperatorType.OR:
      return '<or>';
  }
};

const parseRule = (queryRule: QueryBuilderRule): parsedRuleType => {
  const [operator, value] = getOperator(queryRule.query.operator, queryRule.query.value as string);

  return {
    [queryRule.query.operand]: {
      [operator]: value,
    },
  };
};

const parseGroup = (queryGroup: QueryBuilderGroup): parsedGroupType => {
  const logOperator = logicalOperator(queryGroup.query.logicalOperator);
  const obj: { [k: string]: Array<parsedRuleType | parsedGroupType> } = { [logOperator]: [] };

  queryGroup.query.children.forEach(i => {
    if (i.type === childrenType.rule) {
      obj[logOperator].push(parseRule(i));
    }
    if (i.type === childrenType.group) {
      obj[logOperator].push(parseGroup(i));
    }
  });
  return obj;
};

export const parseToSequelize = (query: MainQuery): string => {
  const operator = logicalOperator(query.logicalOperator);
  const sequelizeQuery: parsedGroupType = { [operator]: [] };

  query.children.forEach(i => {
    if (i.type === childrenType.rule) {
      sequelizeQuery[operator].push(parseRule(i));
    }
    if (i.type === childrenType.group) {
      sequelizeQuery[operator].push(parseGroup(i));
    }
  });

  const obj = {
    where: sequelizeQuery,
  };

  return JSON.stringify(obj);
};
