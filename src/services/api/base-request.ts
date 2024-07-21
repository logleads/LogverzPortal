import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token =
  'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE3MTg5OTQ4NDksImV4cCI6MTcxOTAyMzY0OX0.Acd9bmEA92JMRDVADG-dFmUVTCRjbqdgTZXb2zytNYEaxNjsdsziQelWs2x-WJ1fsLI_z_gWqVzDEcfWX6UOoQyt98VBRFhZvxlzrgeXPoW549wMTm36fxgcqxAr0bCU59T_1Auyo-wohID3e1jf5Lb2rGzgAQCXHkKT5xQrI9-Wcq874-WRUaCHoNFQ_aRbW7TO3XzNgc4SCHVhFmvzrL--Pq3sWe29TuR64DQ8-Du_7pjEuftsVa46ay6XTyxBX4Be7ASBQvrwtHjJMM3xhuMcoEFixUnVGXqCnNvo1Muat_yYe_P4CFfF131j78SmeHHEtW1WcGCf4VVEG9uC2sVvR2DREFOU4pWbT5Tg8QGuv4LrICLe0DKRZ-biOgvOer_aT5zPALP2fzrqYTBrlR8J6Ju-kJFH3sZxKnueKwfJIFA0oBaeObj2LTnOOIyrBXV7BcblW7sLLNFJY5I0w0Q9WOS_hA9POKb03mthXBaBFz_mfd1I9l1xA3z2prYRW7bHr0xbJNOKVKtKxPZF0xrUVzwqz6XHej-xGFyVvr5iZMDARx0FlqtUiI4QtKzCGO3Y5NZ3G7EZ9mxGAWfG5FOVs8qIXpdX4bpyuejuAr8_zWiXGeWh3lNdv0e5ufPs5LdzVs-qOSzsYEkv-jtgNz6hwUFNj_VfGwckrGf45dE';
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
