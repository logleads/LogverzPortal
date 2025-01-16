import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token ='eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJOYW1lIjoiYmlsYWwuYXdhbiIsIlR5cGUiOiJVc2VyQVdTIiwiRG9tYWluIjoiQVdTIiwiaWF0IjoxNzM2OTcyNjg5LCJleHAiOjE3MzcwMDE0ODl9.H9cw2KYUq8DwiGBJjY_Ii-kNOY1OY4LB15znsb53llHnJMobh0NgjtHNXZq1Smugh8yPfkfxMiDM7zj4YXWWoRzu0tMcNMcupBg7bhb4t8ICLW9nO83BIQ0WHwhp-PwC-EFkj5wB4cpl2wRgjQDWMu9-eeRMTSyuftldIiD1wc4fnQ7JtSSo0vHF8JvrUcOpR3YMXxZqeWUVcCWE9pYyaIbDiMbMEQLW642OzXA-3EkMc-BJVElcmMh7zU7Fu0QhVbT8-6KZgpnkRQFbs60gnlrqKoPBVPKJSINoEKOhyODX2Ut1fRvNhugKYszexq4Qh8koxQRaR1gJQOt35MsW-YbUkx_NcEOPBwL86CEFzLyt-7jOjxKntY377ZemhcELIePUuRI39evrMe9obYU7821nB0KZc3hFGCmpP8xuO2LjnLQTREHrwGS8RLFzwNU2GWbGUxXbOV7L1EkoDXMUe7EICuTNW3pRmYnUvLqZuHaheWY9JtcYAsb9YKUuyhmmKCiAcz9m_flkVjcEyiGOZESlExTIlRf4hL1qYvggd_KO2IgbtjhMWS2HL-EXVFPqagJgSZDzPoh29kZxolhWsQwMRh-yFPHfHerEuXDtIUzsWY_5jDombLGnDsXD9a3PYZunCaWrQIAljhG8IfQhDJ2NqK6pSN-Lz-BSDJYeuug'
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
