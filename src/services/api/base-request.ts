import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token =
  'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE3MjgwMzcxMzAsImV4cCI6MTcyODA2NTkzMH0.aKF_JCQNGj1B-8KL9_7MXX8IZ0CxidWbqWzHHCeZ-91UadFMqV6_6NewYmqgNrBH_CyLhd_oS6OHF8Q4y--n9ZJVAlCKgiegYur024I07UTPPGg7Ww7vq_CsjFvkQe4qqiQ3vw9xftAtfxInDrPPF4dVbjtSub2rZ5W2gH4YUXsqvvCkAGCUkoGYx5L4sx2PHsKi7k-xui1ykJldt1U9R4JDxNMeNyObs6PYrhM3Xn6UR6pB3E_aDpI_GeAP6_utQSjLV6s0RFKfCwhUeH6St9fCOIblW70KME-c3xmyDrL-HRfRuaW_zCR7YbuUxpMrjFeREUP9kwzqh9kLtgZz2CejGP-sadcHg1g1B5LeCdZ_sozRNCwpPJpFpUvwKZl3F0o0Mxppgv2rfsNNd1qfVQKMH9pBomSuL52UoENj8PdIKTYELGNaCDbSnq2ZiSNVmjJ5NYXdGn_Zei3LeoJ76oO1ZHtNz5tSjBd9IlHig3zrxqwX-iuBMWNJQQVXr4Y5xkZ1kXyrsX6BVxGqmNA80bKz0YDNky6w6d_Wx7Y_s_1SUtscSDTj-xu0GBdCL3scwwaQjvfmGc7Rm8IKC7_lcg5sFEF20gXArpOKcQG2Je6vXSWxJ70DrnGiZyEE14UVh7BjCPrcvPwIRrA5vq7crvft0Jm-3wbUWWhF4fVBVv0';
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
