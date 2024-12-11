import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token =
  'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE3MzM5NTIxMDAsImV4cCI6MTczMzk4MDkwMH0.FHhTquariJqdckTvloG_y80XZsToya9FOHzERmH2p4xp23uqdLrY8Lwu4Xp0jSa5iO68Lrbhp7S0-Gv4gz_40-5b1bknpbnmIByxoyo6O6biubseFttMEVIrU8DMnAE6zwguegGKgl_Oer4PYM4oJCdhqmSo9gruDxXhHGL9Tu_kAygSDTsrYUv3Fza4AWlx2FGIsyYqDfPfwPB1ZRok-UOVCzWdbTv34Cvln2651pyfUEYhXhqSV6YLfXYumwqWLduEHW36G_yJQlkYrceECFFUXwkJaYL4Jyw3wpyoXCCDqBdAlLfUGYFxbvO_ISsAKUO3qWExlg1BeAT5v43-IAprSc32UicTESn9I208xdhPvqkRc8poDQvhZiuL9v7Se339ofv25X3e10tA3WHWTQj8Nc9eEiIrYWcZXoNSaupQBleyKJwYNRHHJpTH0jZUtctZHG16mBfVKkMvhfvT42RzEFb4q9v7EVx5B1EmrTkUABzvH4x-R50q9dnYwM82XsNyKgzuAkx2ij4aIiTfm2A-LorhcZSx9YrZE-2qB2-BSFyT13mGiQwBzggNxlNaH56VXd04aSfEd4mmw1tx1jLBOaN6dFnmVj3KclmxzAShMfsztVlUUjMeka_cvZn8kwHkY4eqZSX97aFNsYrcBt33DK0aiPJycxAGtcit3kQ';
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
