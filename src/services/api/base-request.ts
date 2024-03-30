import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token =
  'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE3MTE3NzA1MjQsImV4cCI6MTcxMTc5OTMyNH0.Z7SUOlMWQCx_5F_BsU-Er1ieRUH0KwhHZGhPSeqIvvHdBoxjaecf4xcnCqLkASpalIa7ZufxcXJ_oKM9qNS10xqSK8uhxA1on0GwRsObl3mtoOc2HVsB9zrzfoFMkIxU0qgmBF4iJPq82RMg4IRvXTHjnhQMV8qOPG0Cmh0seKkwKgOykNs3ieExVkP7u5R95BeKPuHaIuPHkuorPX3gNtUr7ARwiwteatGezRknhW7lMN9K_7lvOBiil8ek6t74LuYDNDrSOlFlMyuFmqSDTJ-h4karht8bOq6oWj1sDmZ7leUJLPBT3aFxAGp7JiBhTE9FpQ9yTPG4qPZtFCqD4631d3pCYAv23NVyLZ8HFtSw7oA-ETksUMNjDhHA8QsQNiYrqvA7fEHcDxa80BImnUxRZgrAuIsjfjL8gN-yjDb-UV8wxy1wka5HRRUTaZSvcX0LIIRcrMZkUyXdrgAtiRPv76-nP9dCQhsw68jpHb21GL9gWp3M5RmxCuD-bMpp7ZPP7Ow-yf_Mz8H2Q80Id4BhyefA4j3RqftSTvyV8OIKUxLj0ksxirWeTVvuI6FfWs30nGEi4P4fwKtGxsDqnA4b3ulxpEkvY9lawfS9qVachHioyYIVWJmZQW88vLYtJzgi8c-hprMkVQEQ9Q7utkZxiXjK5DOnCnh-2vDAsis';
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
