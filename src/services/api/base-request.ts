import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token ='eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE3MzQ5NzQ5NjIsImV4cCI6MTczNTAwMzc2Mn0.sfSiib0KUxfWgHzCrLsERZRNGa2ZeUw1CBjZACxhs1R0GX87KOliEc8oYo4cI-1egBVOuI3lKW0BTo79BKTTA4Yn2vsFCYEn0biHdLNNQgUXgabLhmIsvcjYlQqO_z1leqdxqzvj6L2mFuF_zlDPdqFZsYQW2dxMASkLkSP6hZ0WGG0CzVXe7ceK_1g1bLxWY7DjuAX8uZY7GE8gQDHdBDxurECOIV6clbnq6DYSMQPhNckYaGVoNkkLMyRaTBc-4iREMz_AuXf1tSMZo6xLq9Tw_ok99gbbMrk0DUycMOV6OWd_B4HOmXc79jekbjlS6A_OU4nyuOTzaXHcC6AHbJizhYTICHsGIjqJLMNk6XAIJ_07yYHF5W147ApkDln3a0TcjiCGD5VusKwftWppKeLdF8SFnWZJUhLAFooACc5yaRnqnBy34vkDsisqzRk7TrRWLr7g6hK1rttPF4snzsPGVHrFW0jpxPSFspprGFHI9EhexiG2wUlMjd6iaC3aa1b-Vx-N9JfuVMUqsgEtpzcmxuvxp8Idjx8ykfHusER-T4nAZdCj1UjQDtd6glyfU6VieV3pm0cl9GrOM7qhA3VPuaC5p1Culie9i8QcuguoxN7N225VQ66SmkEeI_njF84qHwfj0E_kQzZqEkKWSVF7MoxopAUC08dQ5gg8r1c'
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
