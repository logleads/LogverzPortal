import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token ='eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE3MzQwODg3MzMsImV4cCI6MTczNDExNzUzM30.lcscZojZ4A2ThFFgd_yrdWxlQyiB6LCsNNk_6w-AQGuv4GB9Ua0s8soPofcXbVCH8i-KcPkVjjvqmG09xFB2iaJTLKRp_yHlSw3hN8xdWoiVr1EP0D93f41MMlzOED0FPafk60uA1OkwWzuWVA22mU0i8MEifl7knqOq9gFbFyt_aRIT6w34-3mXSY-QoZrz7INFKXnPw6p2xiSsAe8-AAMZiJ0qzV-HZFWQ3cMvkocnvpUEltP58WueB8i1v62kw33pt7cvQxCQZBCDu-CFtMxDV-U1A1pbE9_hOh_jtGyAMT6Qc4KYekdCox3tNQ4DZ3gY4KzcYxwBhph4RJjWG5fblGVA7nxqu05w65-0cZEKkve2Cat3JDpwkM-PhwO9m0YLfqVKbgsYJYniRaVg2uRSrzI5QQdBESQBByCrr0CWtoalH_j444QgQRJsJP4FE_kP_dcqYL4uOCHPziwuRn-TS9nX4jtXvC-rgajSHSSqsqoXf6yAVF-8Xep-B1bwx5CrXf9Ka8Xv6zVhwckTqXTTHNE3lFht46M-w_iDbFwFK0M_CGPsRioj-8Xx7t4Lts2ilQR8Ns561x6zV6FSOsy6icXT85RvxpOwg1Ucz5cpYsawgs5uhNk-2fNquZeS1EZJS8ZK_3QerCt_Blq18GcUhqysmidyMfvAcxetcl8'
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
