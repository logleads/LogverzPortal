import { IPoliciesGroup } from '~/types/models/admin-window-types';

export function parseGroupPolicy(data: IPoliciesGroup): unknown {
  return JSON.parse(data.PolicyDocument.replaceAll('"', '').replaceAll("'", '"'));
}
