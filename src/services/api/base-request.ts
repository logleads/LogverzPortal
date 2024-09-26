import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token =
  'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmFkbWluIiwiaWF0IjoxNzI3MzEyOTAwLCJleHAiOjE3MjczNDE3MDB9.I-Hgc7rfrdPRZTeHQKCKovRkqZvF4gbxKIcEjDE37ZC3WLTqx-sCPkVeqEsVaUheEm_8KMeDHTp9Id59FPHj7r663tOnhWXhnqXcJLfmFaLsy2BHM4JnGJDoWZJ-KvFdMINpUBdSkZa-E1qFstEaZphPF8duP5gs72yi3p899rLyFaR5-Tt1hHqkDo44YhyZ2ge9ZZAjhMfX1ZGK--Ni9O88iaExL2x8ZF1k-kXXZytZsRqSIncrIge-YFf0x4wLO5ttZUUfUTTt41bXM00MDR63rX34-5TaupAiXrugcofh2bqKZ_NOiZnbx1JNx_LSdMkdUFPlrI_wREgz4QPcJjJCOPvsh7LTIveSIISH233qcRUGjz_384wtdA0X-jU-mnCOKA7_BhTDwZcItl_9e__TGDwgdCE2eKoAwxdxlDA7TH86jVloR58NY_3Xj7Mr5KpW-9ILWP-ylTaU-8HBNGFgQKbx5IdcgJhd7IxjTELZKwtsJvzOPH8rIBgV-__ZpuSYWCOtpndJHSbXyh1v67TI6nShVDFRIYeXUtu27PdKHHHEPUY14uZ5sb1GnQX6gHKVkqx50F2g7GLDLDL5AHoUN3HMdONToGyVUSMXWypu6yvjSDo8RvsgUYlfs-s92s504aZfSdwilY8ftdgtlv5_c8RBip7GIxNXYXCfYEA';
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
