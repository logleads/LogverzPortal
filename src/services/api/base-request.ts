import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token ='eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmFkbWluIiwiaWF0IjoxNzI1NDI0NTgwLCJleHAiOjE3MjU0NTMzODB9.ko1wdzGhNZ_Frh2KgCD6c_FnbjESj7suYL_xKhzUilfejHAp2mv_zbz5Y9CSs86c9fw-PJRFMvSOQpRxLFyTixgRz0Fo4wBpnqkwFY4QydJJZCn5XRBxALBGxbmsb5iy9dD6s5QIiHnqdLRxSttyFfg5uQAi_HlcLa3J5yURrWbuyKkSmfeWbAYVsQ11zm7m64NwTGgNgC4Guz3sXZ4Brc20ucfP4ycXJ1mSIy_9790PBRrnt-8fNrufLjI3Orb_jhxWB2bwix82HnZygd7-k3rXNqeEtKXcgRF8yF7r7Zij7iqNkSpQ7Lp-5tOwcwmUJwJQ62lfM3YGwVkbKYrcFV-G6p9DKtTcFZhfqkbAR2CXurXixuMVMRh8aSQ556g5XlkWpNHz5yTmJxlYlA-5bEBoLmkbSBxpHJfvu2M9s6gpwnVi0yIAudJTfC34CzHFlS98rEw01cQf2-rk-BFXj7D1rjBpHPOsMu-K1uR_PZsSls9G4It77rvRs5evMKRlcLUt6ebOs76a_h-CqsLvHlg-DUww8zguOO-PmiYsTRbsuvQzjSFC0PLqmhs-sULZOKrbAf3O_96bXc8f7piC7NHwAmBs4IocI0JXZuJC0dnDNhCaQtiHv7l58yDN5cR0U8E3YeC2FYPO1uN9EsvhQScb6DEBE_wsJrAYxGgU2v0';
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
