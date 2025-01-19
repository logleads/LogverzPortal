import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token ='eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJOYW1lIjoiYmlsYWwuYXdhbiIsIlR5cGUiOiJVc2VyQVdTIiwiRG9tYWluIjoiQVdTIiwiaWF0IjoxNzM3Mjk1NTc5LCJleHAiOjE3MzczMjQzNzl9.HqNQ8-gOq6rBLcNYxliXr9YiXu4n1tHvgHK9pmoHoZpC-65qPR6ps6evB2M-l0mJJnhnEesROlWpnm1GcPx62CHkt0cNcjMkPPGWjQueBdU4MSoo8hQ3Q5QbSdjdp6wPx_Vx84ryQb5hkKOwgAQtCjE7z41XvF1QFCs41cjxh5rtAkVWSyP23_qeerO4ZaeefLyQVurvEsRCjnezckdXMZQhPNVjukBMbvGZzyaFx6Dj5Hhh1jadvywICpDgwXmZnDjMszWzuWyi8HT4UP42KubGsKgpl0LagB_tAZuQdipeNgjzawcLOt3O90uojvKiG3rzdh8ODwTEZyXydAXpPtv8jDfJ_qm5RAanEEdo1jz0F7Qhc7OXb_3HOrOgS-lP15XZl5XFo9usQYxcXqcQjim3KxfAOZjnhci5psQbKGChYb29P4OERwHEDSDHRi-BzfhXgL08xS6rWWNoXjp-UFkbvfmyqoaaxj9YeJQ6C5Mr5YXTY_GALbDwzkd5snuyCA0o861lmTPcuBpVJi81IE9PYRtEj7l_Q9GmcRvRspXa2FY96SVh5jGn_cbtUtvK-s7j-0AMGIJ86nK3VsDRnr6lr0izf40PF9Ur3Cnu7kcj8gbjFOtdzn31TOhz8KXysPGnod5aXDRbAc5Cvx8IV2-HK1YgckwAs2vt2vFMI9U'
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
