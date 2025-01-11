import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token ='eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE3MzY1OTA1OTEsImV4cCI6MTczNjYxOTM5MX0.LENG-e4SDXFrPp7IraQKAsSp6FYjop4leTvoufEo_D1Gwiqb-bg-jMon9nLz1G21l58vonleQ752ENNDJJujPKWiXMf7chwBFI7YfgngSco9LILx4IbhVoPqts-D3wsdsJyy8bn_u5elsqbN3x9qtV1QU9VSLbht34Hu9QVPIxUcgiLMKWgadkbZofrbpAYhG0yuJDv7tYs42F0KArYg0ak1m8R7PuUWi2zrk1bAZR1ozV5eKRXgcOqMDMn-7AThOEAUpQ5reJaOYaHJ7q9_v7GogXb5cUgpG3HdAXirUvDDrRDtsZ--FbgEWh2SnLGesnTZO79GT0RilKsdVcX8uADvLBB2av1kUkE9SdDo5cnohzWgf3ng1qrxPx-Ml5Z-lfJGyIWt2hZLF2YarEny_BbTJGhA4Erlr9zFdYkDmzRho-NzT10WL6OORu67yzuRyc2QvLhJRCoz3f4Gmcxbn_NmLTa4Tfh06EzvM7cEBtMtYT1TeEF70c_Pi90JCrLHWM-91v-AzRx1Yzmt2rV0z52mOSoR2VrHAb7R9u69VoFGXWP_OM597GX1pYYpTX1t4v-z-Iba9_QuBfkq9aHt6VWBhccPnbNU-ePxsY5_0zAhmmMlmB0aoEf_aqgVFM021O8mtICQOeMeItb8OSYcHoWyipNkBaMRnteCs0aAmgE'
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
