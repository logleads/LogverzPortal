import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token ='eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE3MzM4NDM4ODYsImV4cCI6MTczMzg3MjY4Nn0.OBrAhR_xn0CZPzOqmYtyQn3xxdra9nBvTASvEG0hD2G1IZZLXTBeXAAp5YeBNnThEM514qYzpbwlgxxw7wfGifoMrhVbAbn36MQKjch_zWvm0a00ts6tc8wo9tHbnE6smOGa8-LFdrpIcquE33AqCxIPFS6ER31U4rlqVlWuy1Qb06VY4xyRBciAfCnDHkSVoCd4rpn1Gbi6nRjphBTzWwo7EghS6QEd7ohbqvAgw4jQxXNLZoRJh8djXRpgWbhzu0CyAU2P3sZPYhlELwG9aar8C_HVN1BKc47BTq0bFj-Lte8N3oMHT8wEYkbPqtYGeoUxdar9rBi-KZGO0Ia0_WDaCLt6zMAgO0uYstAhRSXdORm4WAeIiIf5FAWVKoDZvx6Te_GGrB0EQp1ZPHHzMd9pH6gYTMIxg8SNHmPdX63e2UBy9a16BkqeZ0uxceEpKWpGrEGRLzjmfwQ0MbG4nCGH7QoHuHTvfRC6o3yXh_AtyHd4ZZIhQRD5KLWmH8Qf0P5D0SxkTPR9_TGO_ftuMSKF5tmoPM7_jlxmAMqrZCee2Rv5XLb6pKZyBs_TxHSZ2jjt38fSBQ6V5upZv0OV7Y_GUfTB6jK21f38SCroQ6YFMue6W9y481xLnc5UeCqzVqwfwvziH8-2U1vhqRIKyylXJaQa8s3CfYsuDn0VoO0'
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
