import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token =
  'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE3Mjc2MTg0NTcsImV4cCI6MTcyNzY0NzI1N30.c82Ct5kSJ6hB1L3KUy-T8-HlTSyPumfMNpuoQqj-iTgTxuQToCrzI3FHbnk4Tf1Sv-T4s7NPSMPKE46LIjEN4fTO2UQFhL9aRc1Z5L4ieJ8YaTNEk2_o3g65AtyMvPMHJqJXK7b1ZLmoHO9422EM4G7AlEFdtnG7LivV71S_KypQZgIN4Gphf7XS7mcIgjZJjTXk0mkzqRmz-SIJVDNZJXbo9DhGBs8pgy_KrlC6zzHlUN8gmldHiiaW2n4a5EWtdTqSLL3jo0sIx_nt7zuCiVFiApWZaSNLIWWLiNH3POlC8GQzIIK_mdAYEZmKM6B9gMUr-ATJjNvEeVNz6lXPjQpWMJ-zrSDA8hyWHNiGMUeXlE6nOETUV3EmsvTWeecYM0Bah9-B76oLDcQ6tp2G-tanichmygp245SDPUatsp-UuUowsdvw15mBvpcgrk7olJeYll-fJs5OBOkr7Y4cb9o8hq6YM6Uss9zKovs4giXSdGNxO5lr3ivWB0e2MO_pUbiyujQJNevT5onsqn49h2-4iLGzmhIlBzIDZchAczsPGbiBKtD-EdviIEVSoaExWPG_1H8ITWzgknCst0XbQ5_DmSI5cTYFLcEbNtarR3RqkAZX24z3FtnqZKO5VcW25Dzr9RKp6Xy8kNoCJzJwBwLZX3wNJWehbqg8s0QNTDA';
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
