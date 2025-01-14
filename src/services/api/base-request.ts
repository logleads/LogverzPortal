import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token ='eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJOYW1lIjoiYmlsYWwuYXdhbiIsIlR5cGUiOiJVc2VyQVdTIiwiRG9tYWluIjoiQVdTIiwiaWF0IjoxNzM2ODQxMTU3LCJleHAiOjE3MzY4Njk5NTd9.JiL6M5UzbzVNVmtmiEsdVbCAdq7Ylq09UQbDgcLv3YATO_XgyYTohNP8C8ouXvRC5rTvFvi1zw1-zQfhI0jIjq6pmelxPgc3Q3qcbP7qSWGFOxFBB8GCqkg8cL5LIWRzKzOd-_CJDMBsfS0uPi1q4PHvm39ljpv6uvzNzxkehXrbABks8kNspwrNg6QAIAamXW9K-Q_Y8ZDrnaEeanLPdK0MZPuMTq-tV0mpGVOuQDT8aFAlaqD4CbSgnQCI9E2BeWJBN7L1KMw6KIp9wMUowL-R_fJW03OWLy69I0gOL78tDIZuy_8m85JT6FGjXbHiE_Mq2avF2J-_tiTISDjtN5ApzAt7pE2cVrYFHnVyEJrtALMahw5EKDqxlWvR7zplcsYSC5XmQfLtF9OSBeCQlKEXCvwySsFkZx1CKk2_6yM-4IbSl4fpzDSkG0ozDmdWUJGGZhl3tGh4-7HyTXcc7NKM38XXOGBNiRWrNJBUOd1ywq5nt3m3tYXRnIlpNONdEF7WAekpBfTjH-trGD-S_JfT69M0E-Z9Q9JJQ2kQHv00QgpxTkkXbMc8X5np5Xbz5VnIVBr2YeAQxR4PtY4cZ_sJiGUW6uHhAH116Uh5DSF86-hp9c97XJe9MvhQXX-9Nnxw5ZbbnmA7vt6v_qbedGHfQ7n2XhZRt7E06kcT3zY'
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
