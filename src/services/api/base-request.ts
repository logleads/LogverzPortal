import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token =
  'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE2ODAwNzM3NjIsImV4cCI6MTY4MDEwMjU2Mn0.bEa29yao-ULUNNmLcAESE23SyJc14itvvAmbsHgatMcvXzeEQ1cofORhM67whJQJqzzutQLucu5crkCcQCTYs1g-gyyEUYAR486dWJelKJLu_TfB7dsO9GJWYWObuDCKtNgXI1X8K89OdksZIxonGm10KWJChHlzxRbKAbl5iOaNgQhQhCgHgfY3ycMl4X7-CrpwCQp8nqqg9UH8dKNRcXRPoEtKfGIL2cGHyoNj2CydIyM_KXACq4IN5C4OFyzgev6rJyzJK94yfubBioVgDLXFSVyI0UyqkCTq1BWt-xfsVNB_Df6BVXacZCJ0HLKxkbN24ndPQ0ulY-Tu6NSa4KKFnSloIfXZYWIfJtxLpcW9YGFx6TqUoiXpR1tMwOREig3t_8m0jkQE-lEMWGxCj-2GVI3P1T_uW6V4g7ItbhLA82EULwzmIwCbxfgYVpkosU9vi1CReW08NBOmqJHuF4d1pbsRuhN3_SpID40prV9DcRA0PczKBShZMtVAOwVrPDxEwxF32rw0K63HK2IUG2YZSMmW5Bi8VO99cDUZCCqEGPDO_xDsrCNmjRwTKfr0IduddnooVefGPudi6gNKNXKPPkzHElaQUfLyXnStiegYgQoZIMYzYRjDaUk2Uspb_CsU5bpFYopap6IJ2egl12g5c5ljebzb8681qgFVPvk';
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
