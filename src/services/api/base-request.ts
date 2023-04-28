import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token =
  'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE2ODI2NjM3MjcsImV4cCI6MTY4MjY5MjUyN30.bK2kLSHVHkl2i4ItjNSo40SpUV0A4KWMy2piu2vOPp9-M0w6qWSzzXY-sZLV-i7HCM-fIUqp1X1BRcVAgkDT2UnyVb7NHolWISBAplVOlOfQgh2esglFDN3oNHA0zye4aDbxJvGJvjzwdG48WlYv3DlmkV_rUGbsjO9sjsYiKGCrwsC7kcyLTpgaigY748IONxZTKkN8TtLkQGHD3Ijki-8DZey-H-ndZDpb3sOEkmHGrR5onhPOSUClDu6o4Cn-gax5CTrUDQxo2eG77R2JJbufSH58asXH3Gnh2eNSvG331eB2OwAmf_9iMtKSi8utGEDSqLXdAdsKXwfbDpPNgHXbUyzmp16ypsPY2BQpyQpqzDYh8WkO8w96MUlpPaiEO-ITBOIW_bGhLhSMAxJTFdN6_I7jbG-Lgb_aWzZSYNjBdn2vm8g4ACQxnul-cVC3citIJw3phhPVSIVc8N1-j8dqFpztVbvtt-26TidjQKG2EujqwP2OgFUhffG-cjjnXbLPJtj3YrdjH24wWIBzFaEfqsCtbhws52zrq9VDTZ7DMykM7BZB9IzMdr0iaI-xRPqtzHESYc2UKRXWYFXFcn0rJLF9HsI0v7UNnVA1cmxgndAD3G81YRfmjXOXSIUlw7Knnj2TWcLr5U76bQdzEad2drH1JzGO6dJjJxeAnp4';
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
