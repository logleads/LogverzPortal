import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token =
  'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmFkbWluIiwiaWF0IjoxNzIyNjk3OTcxLCJleHAiOjE3MjI3MjY3NzF9.qocWwEIVNknmx7Dt3uxwZbhha2Ak_QoV2la3ETCtnB1wOQzj3F4Ng_t6r3W2K04DkvfgdDczNeHcNbvfWGJ0cW_iqwwlXoOFm7ng08FLSpoiscEAXwe5dn9W8QjRrcErC5xZVpGjXQspBbU-RskLfa0AAldCXIVtG8n_scC58EZJK-kisefv_qL5fgPLDjNvQKgigKOzONyKRCSgheBwUiqxik5wXbBmpmLI3npQyO_hsnnuswdhsQh3fJ1-NvZ6wAoNIgQav0ftJqgWUoOWui6Tlx9BN6BE-yMAmECeB6w5H_HWx0S8PBfWkSlG_Fls9sfnn9GK86He27epB4fzv6rZ4ivWsIsQPusoEyTcXAV7rNjs_1mvU-LAs_nSteTi6Q1D2XL08bzWKBx7skarHlW-oNkfNuybosv4g2B9laM59lFjZ4rxOR9ZUvUoVHc4nHHgWv-vVu5R6ofwFcxVUy3fWpfOIfBTaqbuolRjVskE_i3ne74biqqeGabt7RCi_FBgGps7xon7Wj_u3TmqqNR48EpNY5fNG3ny-E4SbAMxawjuSmQZM311gz-hYrkt8jlImjnOaSHE3Py7jbenoDvQR1Jl5O5oyK_xlzdfRVjGctwlfGoj_UVdCh2lCXHKq3AGoFJb72Q08aNtQTQk5SZ5-Vb3crVWN4ahcRCpMNQ';
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
