import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token =
  'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE3MjczMDM1MzUsImV4cCI6MTcyNzMzMjMzNX0.Xkfd_yriJiuArAPjZVNSCV8jnXmrh9Dgvgly_iWrCnr6IBj3vNuY9g6rmtEw3lBQ8bLLjIMS_kVTb8rzVCYujyZbauKnApdhrg7ICnNpanFp8ToOrkT0iCs5EzNkLifuwBWPnzpKcUYDFGkvOtsNtkNXGIfWLTlOgr_MBDSp7F7T4hlsYcXFBInMmBtYVyr0kctMzBAD7orQh5a6znVVtzJ8www0w77GuWV8DRh03lMFk9EAEWRecJg-z_eB9Mv6GtNq_gVs5ZeYEoHfLDLDXwfX8myMfUkXtEbYQ64tdxE0ZgpBCETRS08ZczITuaL55ayB1XkXYpP3iLmBeI5wuFRcflRQ6QV4Z4pT2Fy6mYOw_aq4YZgSEg86NVgWa_BN1w9-r0P6MmUUs-7MsYIEdT07R73HD0bbzDAKGjJihGXD-1I23FrU16cfp3aK23j8y9HD3gBR4zkFYEYfsrqNs8DcVmp4VUjPB6cifrZdmVFkA0_6kUaO7w6lAjv7bPYfGxiz4FgJUmZnMp0RmnCF2147DODlHv4cgeInf7XN9HupBd4cz_aCmO_v4sUPE2xOqGqXmHJqvvwcaTTgX1qYPSPrAG3U5ZtE8-RZrKLO95nT4EH8w7JcphdVeyLFZyWjHc8JvZ4t0F6JkBHr4Trfspgfg8jQ-8EQokCC94AuASU';
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
