import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token ='eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE3MzUzNzI5ODAsImV4cCI6MTczNTQwMTc4MH0.flYIQJaYq_DyZqBu9QcdqgRjq6su6NApkwOrW1Z1RkZS0T3kQM0AOXs2xz1DJtmVAv7p14Jb5TSx85mJb1ImCJkFc09hXklSveE2doYzWeX0Sixw7bDGp9LhnX_sUgZaOQxU2Zw7yxP69Qz_8yrYspSvaEl96b5PYxYfBKV1BMn7FXditwt5hdnlbYAjnmxGX8aAbaW2fhZR0qrFHOUftiB5MYXdoP1NBIqbnfd7R7RoYdTuuYc6SUf3XU5EKUWKJXt_yWD83DhhBaR7izBwzlhlLakDAjUyjiqO89cQmGDkcnyQC3jz4Sw7k0pbmy_cUGOL8aA39iiUQXRRND1LMhNQk7n4furC6f3KYo4sd2ZJuQ3eb4HNR4tPfojIEEPS_s4L11hLgaA2mi4g-GZAepDIFUNKHjDP2DCJKJPNEgprW6To4w95FoXX2TQYEbCGCh782Z0cyhkBeSgThW4bH6mGIn_bFHCfNaTUluRJ8LPSEpKMyl-heAreRqHpVs1K342CtUxM6RY1kI9vuxLFBIQK93RoF3kSNdDdodJVjDF_lPpIiuCuJvySJ14SnRmOw1PCfEYp2OJeaAKs7v7XCb0i5V4o-WFt9M7R_A-qePYwpjmoH08n0yOKp4WWQ_HrAqMHiGPJHklbeAKfbFh2j-GP1yz9RTJ9oGO0fG0CnG4'
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
