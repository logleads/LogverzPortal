import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token ='eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE3MzU2NzA1NDEsImV4cCI6MTczNTY5OTM0MX0.ho50A1Lsd6xczPZh2gBwEfsraOKqLaNILBBjazVhfjWsvqlehNbrDcFbPwHk2UO1ghv0wTdOwMpHM4rd6dKMarM-s0AiospDnOdXAVySah_yxclCDlM83k6lEHGizznZBcuK2xmEm1XZY02woW0JGjQxSDC01TNCi1xPRXDqdIGjE5jJZwjTGozU-_V99nwfUGWELCpS2bcdE_TL_ObnMC_Iyyc9agT93zzCZh-NViVX7zUVzjcXYihvyXNgSBo7xk3AXXnChtZraPfbEwOQcLpDJRTb3jDNpLWyCb6dN5EQsSe2wJKopwxZMQKUmbkzltkr8tQPuFrt72IEhVDJTc0Wj15Y_egGV89rb31d-f9jYP5jgRWspurg7UCq3jjmah83kyhgfLHR2GyVTXPmvyDLJhyA3XmuWAnP7hZaTrXBVbP-mCFjPKU2mRjqjgo6ufmBoSl2ragz18s3-NheYLQ1RUuw6poOnoQicX9ykYz5yrpXndUlSM2rg0jyQzn_z8EMLVx_aDWE8BcmIz68_1sQT4ODl1vok34fs62n6rTFSF5CoEB3IOnBJcs3diwf0JdD16fiw0K-NWMR_TtV09buQ6gxO2IrP-gUdxwstxg3XMmMPUUnFd622IjUg11r9_ZmUf6uThhqs9KHuSbncYVVrMdx-r-vgp38RuXHhuM'
const instance = axios.create({
  withCredentials: true,
  headers: process.env.NODE_ENV === DEVELOPMENT_MODE ? { Authorization: `Bearer ${token}` } : {},
  paramsSerializer: params => {
    if (!params) {
      return '';
    }
    return Object.entries(params)
      .map(([key, value]) => {
        return `${key}=${typeof value === 'string' ? value : encodeURI(JSON.stringify(value))}`;
      })
      .join('&');
  },
  baseURL: BASE_URL,
});

export class BaseRequest {
  static get<T = any>(
    url: string,
    params: Record<string, any> = {},
    config: AxiosRequestConfig = {},
  ): AxiosPromise<T> {
    return instance.get(url, { params, ...config });
  }

  static post<T = any>(
    url: string,
    data: FormData | Record<string, any> = {},
    config: AxiosRequestConfig = {},
  ): AxiosPromise<T> {
    return instance.post(url, data, config);
  }

  static put<T = any>(
    url: string,
    data?: Record<string, any>,
    config?: AxiosRequestConfig,
  ): AxiosPromise<T> {
    return instance.put(url, data, config);
  }

  static patch<T = any>(
    url: string,
    data?: Record<string, any>,
    config?: AxiosRequestConfig,
  ): AxiosPromise<T> {
    return instance.patch(url, data, config);
  }

  static delete<T = any>(
    url: string,
    params: Record<string, any> = {},
    config: AxiosRequestConfig = {},
  ): AxiosPromise<T> {
    return instance.delete(url, { params, ...config });
  }
}
