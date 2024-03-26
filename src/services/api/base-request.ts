import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token =
  'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmFkbWluIiwiaWF0IjoxNzExNDE1NTM4LCJleHAiOjE3MTE0NDQzMzh9.hXJAkPFsE1vRvDfPE9J413GdZet_9cQPXr0so95_sjfNE5EhAEYBCKVVbCfKKX5SPYSRwOqUJIiuApj97n15kWauWWO2ckffZ1OKmyOkz3CZOHtlCLrx2UUGU4POz03vkZjXe3QB3zwZ2Q0B3Ldf9iFBSx2zDk6uJp8YibRR1XffDR4yPaEP7e49J_HAG6b9SxdahX5uYEYT5G8CMxYR9BCVovX_Y3XnzvFOnRw1rWHs1YKTzRKWqEElq9GDr5PjKU28_YfGqhbYJh8K-9d3NQ_an1UFEgiCOY_BhdwvsSW0Y6_At7jDj9bx16zEG_waODYK9uciSBFHFm2H4SHF0slIN8PorZfyRiFoLPNdMlhhmgyCCBKdrfuXVQQUH2A6vO6VinUYKwWaa1AvcKFCAZqG0AgN1OyIMoVHIzsc9aI2HVS-OEiB2u1Nr_YFu0cdxpUrLHkXdyUm2NIUE7FTMwmny1QScQ4xLWO7Trpt6XWLPk6q1F1-D0eCYOc1QKZeHlJp2zlTQFpkXp22goE987SCUVngahL5vq7AaZHNhMtmguqKs4XodyN6d-EjcBKMn_qxBJDmhsfry-aUa1-jHk4SYYDZHQq70EsrbeFE3ZkWNrngBicsPvXFd2_GDvz8q8dgm0o3XJAgEtSgW692vrCXqK5l24d_BqmLxgjrySc';
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
