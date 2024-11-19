import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token ='eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE3Mjk4NDkyMDksImV4cCI6MTcyOTg3ODAwOX0.K1rXD4h_aruULwhC62onpy1KtUr-SVrP0gLnBkVuUP0cKQk0yKWXay7i1Wc5U7uwfyohWgvBuLqyiUySOh3phuO5EGE1xekVr78DWLJMeRp3xsT34mQLurawOZa7vRbHUnFMpeymDmnWZU__Q0H-Rjy4YRFRihC3WoAZUxfi3HK4Rxnh87I7m4lYKlrwksfxeec9y2yCRb1MO5xj3TL8nj3o6mEwA_vLpTZNkg_EjVGrMcMla9t0HC0jd1cqFLb2IlRVSn0Dr15_Mb1xdPMCdFQ7uCdpPb4FcOZoXAeEPKPm85naUppjoW0LUf0B6NOxOq8SrhwuAGlJxkKyErQtbK_ovrnySMdE_yP387zHaYT1P5qXRG9Q_YmFoTKC6pmBzXfQf8q_FYd8giTXy5QiPPuThC5PcyszueghcAEd2npJaA4wEKTAGL7RoNLYoz_prj4prLK7sS8Nmu0ZLmcckPbn0PyyQO09YbudJrQMVxCkGj9N8y1mZWOCtSlpgOuRKNoKvfXxib1ijId-_WjVKr-4V0Zi8AIwOYaF4HjR3U_YdcHtfVw940f5a1vIGkB8mPbvxNL1IqB_1psSZXGkg1FDIjZKsMOkh6oNsIbWTspbtRI_8KvExDtaI6iLBTapX8bRI-hK348aL5PYZl4arhBIYgrx7dLK8toLbKTMA6c';
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
