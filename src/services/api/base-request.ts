import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token =
  'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE3MTQ2NzY5NzUsImV4cCI6MTcxNDcwNTc3NX0.NsP3SJLXTCe6wd3TzoNfW9jX2DQf_niy-tCboJ9bX9AqDkHd5OZBpvbky13n6DatXvqz6NxlgHsTejgYIAsD1V-VLJhzKuKBNOa9fOQdtxRrtcotLxYd8ixgbJ2Rm97sK_nGOp0-DPlRCmgwlMLl7dC1RJ3weClFg8gZTR0Bs3ipADkyWQFEdgSAwfEzpTLZJcUg7MLxyRGm9qIaErFLVwmnkhqZFrf-1wzT0_mRTwUgUMOKniwqTG7n7GfsA4SmpfVPqobQwt3k1hOg5cfUPaIWMHyaxIBF388qzTB0GQ-b018aZ_bGTIS8crl4229OVfBJ915a1hthNmC9yFJ26bjZZCzimgp5lhTIy8_2s-pCV6hr5_kNjL5Pw0UBcN2rbrZxuGGLdZQYY_hA6DuIb54mVQMyNmW5VtJgcLpLstf9VYPzvGXSCvsBbpACZVHVXmLF-PUZI6OWWo7yjXiMMM7zRzNqTel54gEOTeYbEGAYsOiJrIpsRfr_DGHhPxremdkm4GnOjJ74u1X2F91SvXFQm3j7bMVgnLq7ifPK4riMRA5ttTJlsO3BNfVDageE3z8ie-ZHYw0FNb6UQrw8xuZYW2tRbUR5M-n8EH9InmmpQ4cwfZyEAnmWr2K_pAISab4zcEQnmfkmrx3b_6TM4E8fyZEmhupkAR0KGv24SSk';
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
