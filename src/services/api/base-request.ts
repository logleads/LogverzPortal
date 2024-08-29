import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token ='eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE3MjQ5Mzc4MDQsImV4cCI6MTcyNDk2NjYwNH0.c2gv8J4PEzqHauZqE9fhiZwCsFNTa134a7Jhe4bgacMHG0EIcl6yV_e5XdcDBIPYuNl9thpESjeEXXam2nI74gNdGANemt5R7FBqPzu0equasCyyjUgPx_NoPHewnDqOcE4DfC78tJzGweyqxjqHqLbpZ7Vh6nHc5BqLR_kTo9Hu9G9QBWDtPubGeS9ZRRyIJEMt7zWz8QdY5cl5d0SD5Y5W48cuHLL7JnrxGsdCcKDVw9NNDdCLtka-H4qqD5LkxayTBnT7k2v3sCvN2Sk5JgT9dwbNDDVQwijJ4h8Um1-3ZFS9WMoRC7NAhDNN2AinTUeoX0uoD--ygA-qQEKdetTMUznOagZvPBQksDFxlf9AXthi6F6SPE6BaZZA1Vlgdu2gJUykYCzp70C7lAFsvtvsexlaWsHdZ2o50hbptrR-y2C8PFKelDzK45u3iYx6I-EEIqsns9Krl3OPZ4h6vTUQUbSGlzZtbJTn5LN9tL89o7AMqzzRVzwIpp5vF0hV6xQeLZrHZoCCEGpqy1DmtIJNiPJGmZTwovXi8ehcFn5WGXYlIDxoWG7t1M61UyKUKT24c9UQe8pZ7u1jLS2oYXeogHSNwIAPwiIioQHbslAoma6WRWMLSADq5qJI8hqQvqj8Fysaw6-AOXnzIzF6Lg07hYFzHYgQTklmm_Qn1ck';
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
