import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token =
  'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmFkbWluIiwiaWF0IjoxNzExMzIyMTY0LCJleHAiOjE3MTEzNTA5NjR9.V199gXsWxD0k6MINrVCtEuc5uGhiYIcNMbFvEc1qaMyS4wIlr0pz-YVu8qK8JHTPRdRCB6PJrPM4dcXzPfiVC5fJuXxdbqDjs_tqWjSnXqBxSIRLvWOMwgEcxt_OwgHGP21lYu48geN4qqNnwPrD-HDfUNMgft-4mx-GqP37DlGBkVef9emg5_nEsGiScyjeK0G8Da2UrofU9QNUjmkKQyfcoV4mkzLAspXppXqiKVtDLkvZIe6adgUoy25Mp95AM62sOi-3CHe4ns6Ce8zkv7jGDrr1B9DnoyuOjrEXg54zvdAHQv38ElM7I8LuE6Z7NRt3f3GXehsLADEH64c8XbfMF2WBFEda8otToduAOJRoctJ49dJiAgkd4GfPZmT2oGX0egpBrL2ek2aC1nY-Gj8yNlnjdJvSah9c4no4TsUKiCx90DliWpdaovPpWBSigBVrLNzCzrTgOrroPW2yJEVTfLI9JIE4JgsZ2m6ivJMFQupwUq0W_SDkte0zYOKIiXYtUxmn9fpxaI68zaK5-0kvsBEwezC1SWQr8f9DRl17YDnaioyV4Op32-pQeHAmY5kktxzpZF2pKTFEMkPCn8foLeaMViE8ZIUJH9iv1YS5wsRUb9F3CMZyzSb0IAp4nm5otK-bMa4UJ7OHhgHe8PR5pLxGY_O90vmoc8DB2Rc';
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
