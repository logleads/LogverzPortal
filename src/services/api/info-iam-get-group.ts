/* eslint-disable no-console */

// import axios from 'axios';

import { STAGE_NAME } from '~/constants';
import { BaseRequest } from '~/services/api/base-request';

export class InfoGroupIAM {
  static resource = `${STAGE_NAME}/Info?service=iam&apicall=GetGroup&username=self`;
  static logOutLink = `${STAGE_NAME}/Auth?apicall=lizout`;

  static async getInformation(): Promise<{
    Admin: boolean;
    LisaPowerUsers: boolean;
    LisaUsers: boolean;
    UserName: string;
  }> {
    try {
      const { data } = await BaseRequest.get(this.resource);
      return data;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  static async logOutUser(): Promise<void> {
    try {
      const { data } = await BaseRequest.post<{ Redirect: string }>(this.logOutLink, {}, {});
      window.open(data.Redirect, '_self');
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
}
