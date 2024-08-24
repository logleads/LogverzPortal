import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token ='eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE3MjQ0ODg1NjAsImV4cCI6MTcyNDUxNzM2MH0.EgJ0j4JMlJ17byYnMKmTE0HbUM6P976cIXEML7D7Cuy3Bz9W0XGiGzTzgOXaXN6T77T2NNVPrqpNFllXBkZJaQAtHozsslEvS4RNoRAyIOEFxztaAtehvLW99WFsk79fhs0CnY5rmj7yAeEizQNzdsPNyvAIpdhzby8Qc6Wa2TV-zqJeTikv2aowbZ_4vwDx8Ta5MxxSWqpRPjlW0OiMFW4fTzsOUMRP34y3yrXzXDzPP7sfk63CV4r3aJxKn3EAB3-SAgWQLnGKwVMbPFhe2VfEIXd-76_ngITwq8ZMNEBIztizHWDcCHqjh_DWPE6IVL5NMPeWXUtnvgtnW-NHoDWYk8kr6AH730SYTqdit27sF-UUL8s8g02BLR72DmOH1xpth9nHEiGrgvwZDOKy_owyA4y8FGYbx9eZOGSbM_CFBSfE7a4nxiAtAv9t2JMtChKof2QrPepvPObs-1wzZr7EY5ji2joKU-I05KWxLY9EytbsKL8mZV75ih6c27l0cZioXnDqF2lDOBTl9LYvOJsooI6LjkMJVZu3nW3J3E1-woGGcKyMIjNLPw71Fyow2GYCvKGy9WiM2AWowmwi_lMN0nVRLHx9l8OLdybEe1RBOk9xGD6-3XURcIHmxcnHIN9NCEDUviWfrPOl0w1u5WG2JIaomBqO44ROv5IIKO8';
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
