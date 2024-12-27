import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token ='eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE3MzUzMTU1NjUsImV4cCI6MTczNTM0NDM2NX0.gmpVCXDvrYM9OP6A3efnMloNLrfXdTbochRG5Ddz39wo0hzkn8V0GgfLzfIXESAENg_MOHPV-OEM-pO8V8iQFIX_LjfQXUxB24Pm0aaqXbSKYcC6eeHg4aLyy6I7qTvcQV_0OzIWex9crI81gbmZ5fvOwEK_6vMV9MN1tufcWe5xAVevs6nJJjcjC4Ws2Oo8A4lYNqShy4QYckCmb86nnY8pNOwWvICS5ioc60XWXSvq_zUR-x0OKtY_WJQ2Mm1TXXtEceDOLr7lC34uVUdScusu0yYN45Yg67QYl5rxn4zbvf-Yi4YXGI2rwKOYTmFXZaz-J3SHUw2sSv0k2WLE6QDhcEoEVZTg6_yaJZac5XDKasMI3WeRzRa8QUnVsKe6cJ-cnQiTDvR77yxCFZUuvEmsO2skC_5Qyj2yYsTuolS94iMU-x3ZPYWlGH7s4S51nYKc1Pno7ImqwrByNF2DPrpoQ_FZ_rLK-7HBcCR0MjxNARbhhKC8H-4sDD9VPd8X4tyh8DhSngCaJFk1hOaT9Zi_NrSt6TI-VF9U8k3RLpNqnrKZqQOrhRIm2jnl91eUd_N_632LhkNI7Vwti4gYGqzzgwbw13gL6yuD20sO77cFNwKR_BrMqJyjTbx-VDj3F_yVgmU3IJIaFICTXrlh4CwxhbGQ85lWPIjBQhXq_WM'
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
