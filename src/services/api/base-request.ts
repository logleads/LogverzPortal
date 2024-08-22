import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token =
  'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE3MjM5MjU5NDAsImV4cCI6MTcyMzk1NDc0MH0.Hb_adfYElAK9rrXpQZeaXiLbShyEqTCB4x4duwuP7UdZszk3L2Vb8lAdsxeW47jVR89NTBAF-ab2e8YzNk_ZsrEZhU53zajar7AeHYCIem3Sl0e_W4OjR2CxcEJvRf_b6EVcj4zr99KBKwJmYw1JpL8ZvvsKMo1lSxF_O0QiWmch1_gQSG8dQUEz8AEtgeGryy2zDIyl-KPihu57WQ4JaF-YkntX9F-h93Udj40JVexvidH3gvJXAtz4-rMNtsGo9sOogh4GXM44WpxXvjKVDjMbAIKTQme7pkn1OiRuzQdWekFrMmFWbdL75bZbT7p_H0qaxaIcDs7kirBwI6l3ZA0FmldtGA3Sn-WcuIQCoNGDjNSVAArZ_Af2D-xnkhk6Y7IOFySW8M4IdSGyBsnuNXPXGFzjp9oGHE7wEItnplC3irTW7snX7Ck9xl8LBrb8Gp2rXZKDpAgmR4mIzffX9g95ldsnAoEOCKJPKghw4JcKB_CRDLQyoHclkaAxJtYxO_p8GzJ449umqNuNzXq2ljuU453AY9SXpzqxhDVlqQs9RvtjYE4YNYWDd1GirpJtWk-esPfDedpQ058yVPGriXXkQHLSrg3D4NxxWygOHYhQuF2DDKh25h3I2VtnbZJtkUX0XQ4V_OOVw8ffc4_ArkVh3uja0zwV3dqQMokJsW8';
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
