import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token ='eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE3MzYzNTAyNDIsImV4cCI6MTczNjM3OTA0Mn0.PrijFqbHQoXmG2TZleEhTzCs3gIlTIqGfWNboxt7quKQwfp1i4yd4qmtsaX4xtZcjsnQPMHR-wIn7jcksUOJqyjXF67Fkv2oAWYAaXWWpt8R_pn7OP7nRodyArDyAngacUbbEjtwePMw7TpmTTTbnWJ5vzSR2MUYvNe4tg0-IhwW1NLR8qXdTFbhT1QfXhZqikc1-DQfDZe9oUioJhIPTJN8ILRysLMMbhMYB7Cls_xzWpGkPyGEhROEusmIrK5nJ8XVN9oPLDs5CetHxOLCnrJ5nzIZ86c5s0qIVMGQFjB7lvCbacvs8rHLdFH72gnb-Ek-1NGiGMCTrXJvcRCIVc-cKrZcG_bJ1UXdQOn8L2VyFa2zRMxEwb0jUX93iC7908-Jr2v2TpY-omBD7qFe1B8rGqAORuCObphL_GFuGQc05SD8MrzNzH82g9_iK6fRHJdYYj14s2zfVJo9Sw3kfqr-9nstI-XU1b15qgRVSBdzybF-CQXukO2OtDYpmQbb4DyN07473E9wV2iI0bJzrC9LJBuH1Cxfox5lZAyp0vrDe4OCHSOVDzK9Di9NIvYA4cDHG9b7nh9pMKoKAh1GXg0aXOmg2Y9F0N4Dlw3QLZJ0TWvHMK7O8AWR2BM3zaaIRZRQyfvh8trgt_jXBHkZKOsH9Z9ocdB-EG11kN39EWA'
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
