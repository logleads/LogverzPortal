import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token =
  'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE3MTYyMjU2OTksImV4cCI6MTcxNjI1NDQ5OX0.gHQB0b_FUIsJYNORJ2aqGZMyIWPPDvJYAmlwxL4oNhZpOx0QMcF2LtBVjfD8f8GiMvRS1k5TMGYXF3lD9_O95qpgVbKEU73_A6N4wLL67HJ45bDc-U0PPeSC_6DTcN72idmw1YJan4DmE3IcsEmyaJxDgHm1yHD9Ejx6TdUMyziRMVsXWLGhjrweazD67lMAvB03M29vmhsHkakeKcSvqcmGKVOQDOzFnDj9jmtzfilTwYPDrXxZdaMsK5eFB6hLxfz8tNi5xMH_dEYiH_rG3sGmxIDkZAFUZlxzJ6bGgqHQTWQrRh3eYuGDI58ioAYpojH9EWts0-Y3vtKtOp-QCYidH6zBjhPhEgNmoG6srfEl4l0UUCU-HWIRmBw5uEZ1KUElpATuSktP-7NpT7wChqkYFU4L__Nflk0UjaJ5cp2eqcr-ziyZfsnBwZMvfy3yd5nD6qZYI0R-JPfrRshKVJftjUm-lJO_yUWfoY0sm9cGAVAbto7rCmEcc4fbw-1d_CTvOqjRRxhDXZcZFQUjmzqDdLHVPLxUPbZ6HYhfN2ig_GmxcbDUTVyK4hPp8xQQRwiaACISsHkfmJifSu3er06SE2M1b1TuJZamohdjG2VUtfqFSb9XgGSV3WTd11Qs1SP09rL_ClSX2abCTXbf8DaWZ_d1U6tCMvxsfd1Pr18';
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
