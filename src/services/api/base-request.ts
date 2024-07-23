import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token =
  'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE3MjA4OTYzNTgsImV4cCI6MTcyMDkyNTE1OH0.LIot1BMNf6XHTdaDG49xA3lGU79MGglytsEvpbXLr8hJ9O3od_ZO-LBGDqMaLn-jYr-Bc13TwHGM4kDacfQWcZahhct48ey3ggg4rPxY9h8UlAlHmA-qNDvkguX3ZdIh0_lbRhyKsibING0eSAUH3NnPMx1W5VpZ0Qo7w7d60bV7NQQMw2AcUC25KsPvb6orQAXn-wyDwCN_4dH6DBY7ahRudfxJxWtbyW9fMeirNgI58P4HVxYwZ42Ye92CgNhw0qiG4AEdRk-KZZiPD0f_mOi4IvVLGsB7qe4pr2ZuOuKhmgEayIf8CFi-fhLQ9juOyCnX0b0MYn8209W0IkmAYAQqFGsVhwgqd1YoL1T_dPBa_hmohxE1fT1XtRqovr2F7I0QR4yE2sKvPENckT-yTcuGG0Dh9s5KLfJngNea7ql9KU4syCZmPmmsKWXjI7eGO7Frn3trwefsTiHLS2-l_T9WX9k9EkTaob0iY90uNTaubvXrskk9cudIj62GGdeS8fES1I3NISr6VADHd5IZ9p3K1iTJLghw-2vUtaVUGqBtAJ77TKHe-6g4pWy3NRBLx260wX5Bq5Fq0UZH4OkThNeRcfoSJ9s6lZ1xRrd4shw58JIEH0CUGyTBCcDeCljxWX_Ed0rDuAQJTZSLIIGt3Py6xdGrJWFOva3DYjMWcc0';
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
