import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token ='eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE3MzMwNjYzODAsImV4cCI6MTczMzA5NTE4MH0.M1AQWmMCLymQ-PqhXu3aQxcHQJlByOQi9T6SX-9kq8R6f6xDeHfIi7BS0VQHP4SGBzUQxfgIzSDBnPXRpm8qtDzqvaGA8dx3drn1_QIbHGbqxtui1R5cnc7U6Bs05ZwNL6lkpWgavk-evyDu71RUOamQNu3NDgBUGiksV2NswhBMlQIhQQ_IQT-NIYJb-VPXzKZWaQsY1FOkD5OWHrxRkJKh8u0rTTfTlErtg0-UIoJyFP7RGiFSjClqs_EnmJM0aHqSUDFG4ePLfcaWIN1CxY85CF8dT8ltswbJELHyQFtoiLLGR_4W1vJhw1zzhQVbspGRkOypmhAim3WVG1-4gb_aWAuQMTJ9pPNc4JXy0wrsR0dhYVCJ2JvV_h2sgpE37kXyMbrVfIBswKITZMdMWiUnNiEwcB8uaUZYR2IDZluE91T9u5YVT-f4SPAp7KEBkuN8GWWIHIHdjVuK6oV3N_tskKAS18zB9zgQktQHfFMR-HafrTWYxpK5a-jZhWyuZRRF-fEsIeehGSiURWuFWuUAZw7kq2o3ul8G3bC7I0MNSb2jASBHym4e3xT57r7N3Uz6uOZp3w1t2Nc42ciA7_9Y9wKiRuO1LJBi72OQIPpbcG7Q-_wfptf-jkcqHrXXvRseA6-8cSOPl3ymfN6-9dGW8-teyeJ-YhDat2Bv1eI'
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
