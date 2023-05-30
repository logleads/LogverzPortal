import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token =
  'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE2ODQ4MzA4ODMsImV4cCI6MTY4NDg1OTY4M30.yFgJb39003MidlvI49MeixgqMmCc1tXRzVCV-yZ5uQW8NQgfhkRa7tgqHR_6aBI9LYbfrcpZ1uJju_kiqHVmTTbBIglBgL0HdHTUPexYSstqO0ZKAmB3CXArgQ2YfuoKrOo6Nnrj2mPpq9qrDo0L9DvLAWHX8FrHL59dCU1C-d83pCrjnseOlQr_VAi8NWQKHDeKxQH7CJ8FQcW9s9XOchJKjjiG9YTl3UwYBdIxEcRL9BfdV_7wM4rzG-gh3-_mnHx0_sgyj-0KdPNhmTz74Epsno8eOSGHnWbGlH_dPaXge8S7HEqvLRpAUDCMRjTX_IjPJAGhDsGB0y2xrHRoOb5Q891Z91vhevMbE6A6FfZ3yO8e5dyXlBhu8EtnKNgHa14ZzbC4NP5EweURjFo6nWluhwkaCYYiDX1CE4cX9BMtqAZT8-tRPeShrxrg0DJCu_xavhjNxiIQ6U92Qse6NVwfzPnTlOOthxKF20-yROPsvlw7qGxymokua9MUvSRIRIgfmHkUBjk7nI3sLox5Qmcm2IVg96Qit2bukHY4QzpfdlejZHBEZ2t_E4PdNo0a5xelFF1lC4eLMTNB9alg-jmu42anRHDg-zsJicIIt8OncSjcJE1czBVYkElBb_7Qni7priGtAyfMqfOXndNT1UxFqGzdtAuCoqegd1Nf62g';
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
