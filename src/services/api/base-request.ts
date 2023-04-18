import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token =
  'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE2ODE4MTY2MTgsImV4cCI6MTY4MTg0NTQxOH0.Pza4p2K4IktNzHfDMG5OGoQJTj1K90wRFwCBzyeLYVYI8pB9uV4_V9dbBbHInY-hlZ6OsA4GsBUB2bbTqI160iCwVc5mVe4uFlgDabcUcalXQvcYfmd0glmh1dsIVANd9WYgxPhrZ4V7OiuFpZYtU4wj4KVcnw_e_louVE4G5EeqgJBfdgDEcyWrLLM1_XjBX5Km57V8ShiAST3mosPXGNm2A13vwx8kXKCEXa5Xv_Q705WwC_pAI5JVhZ8hD21PMUMUrHGlpD6sOqQnfLN4GfgxNJ8C2Yxrm6idxkdTb_C8QXzjVWjjcagEat_mwlZhY1RkU8Oz9dwYC2xZAXgEAinTONA6mkZedTPI9reIQOdLfuRCAwiZojRNeItJp9c5UTv9X24ksA6nUxGP5ygpOy3T_XJD4p4CptxPKi_PGFbzs3qtQwzOXNIfasXwE8RrNRH0V0oQB-XWYW5jTdV9gxpbxosVF8bRFlH6pUoOx16D__FrDYejSdaCQzBvQViZ5Uea6aCeq_1LAEWXnh_r7vYUW54yboay9UXEUzUZxipvI7UaVhQv5hudMkejD6OH8gSOgL7jgHlcxFR3FEzPPJCUzurJ_ZX5JGP38SlxDliw9FOLSiX18wpA0mRNdYcQ5aejXUX9nzDlkmVPADszY82qXc2H9A_9C9mK5ajbrBA';
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
