import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token ='eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE3MjQ3NzUxNzMsImV4cCI6MTcyNDgwMzk3M30.i8ucHpzStL0ukI6iJuD36q4Ez-rfnKtqQQwO3DtPOeDPV53pmzoDD31mMfscQpzREr_Llko_YlbRcZ-hJWl7-9HKKZkhBCxC9xcMOIzOSW6e2uzvovtncM7q7_u19Je9ARFjjtiR47WjhatHkVaNBYH7GClCXqOplbtiBX1LAuKIflLJVRpjoGzXU_mpVvD357aM3BkuIXqsqQBLgr6Le_8uzYPJa8iYfJb2JcU44rMovCrgc6K3tLmeIDfcWi7X2S5VadE2d18JCZPX85Enceruk4xPYwtGQC6HZbS6TdmRDAZWeUrabTxgPU4XNkhld3u02P3jslBcSjVh3MRU1EXU2l-ghA2GJQTBtJkSYeo-cYIsOZh24IE-6swMW-tKLx2HXsvQj_dgIVBS0fxTQkmDbPZx0rulm8QLj3pzvhnNWB5gw_VrSFO3O_MD9bcGfK-8ScTYbIW6M4VKa-XpHExECUT1h05O0TNxtlp_2cHBTuKjRI3NM1WjaVEGtgvDDPGkZkQFfvt2BFwEpXPraZGsZVlwr4S2UB7xt8jgGfRe8Wj1okQmtMdQehPR4N8BMuBlyIvOc7FuV-aYVyqTrScU5re7kYcVVRHRCLYd7NUB0-OGVFB-5xzCjivb8-cFQezcECxEuRCCeevZoxcBdAPJuoOQ6gpGv6pU561t4_8';
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
