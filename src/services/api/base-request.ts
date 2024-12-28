import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token ='eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE3MzU0MDYyNTcsImV4cCI6MTczNTQzNTA1N30.ytkdlAbYtjDw4p2y2CDiB1SmhRh6LgiMTgnHoq5V0SHS8KlHFDWR7iNFNAStEdbYRYcvvWKPjI9ktKTrzTFDALl42PplU55EduHLzMwBepKf2g2zwHYpnr1BW_dFLGkHIW3uThriLf8JuB0FBsnLZF0ow-Me7ETpNZ9-IgjRh1kMHf8S7Auioy8sqZB69Y9lpelcsl2Ig9HpWl8fwfk0qVGNG0lIJKoBZOH3R3joKlib90xG6HL1loGipT7sSnvZV6dJFd6u-P52GNoBDlnFdfFwWcPPDHHSNq9o0-dSuhzBGrMQZRgsWgimDMStfNQYu2zw2UZV0AwXozsORpfjcYehsknnesIK5wLN_m6cpfS_PHYjDcPx03KJ0EyoYLq81a-MBXq2R35f5Ol3IjLwsCi-C6-H6S4CVNobA1vXr4lbcxG_yJ0fVwjvw-7BeNceXe2mYx5Kjg0_kB0J3r1cvviUYlh4F1YOOlZ0TgH33b501fydCUFxzjlMiLW9h34Fa_Wm7-vqF32EsqLPOUjAh9ZymNND6eUXGX0nx2A0wowxxvyFHlnVupnucod0qqBRv7zjq5MnC7JgUxpMYpIH1v-5mbMH1GWB6MSOHdAPtKskRL4h1D2VT5l0-OVMNZhn7jYe7ChlrR9Xzmky1tuZEtNkWqrf-xZJaT4-fo89uZI'
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
