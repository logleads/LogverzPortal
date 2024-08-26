import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token =
  'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE3MjQ2ODU5ODEsImV4cCI6MTcyNDcxNDc4MX0.chsxV5TaWjS7xPkDOe1otcEX5j1AkVoPZhkQ9BIJZ5C5z3RK_gikKrlgKQL7tl0M4C-LoTJAAaKqVRlmJU6oZvcfFKOKspu95o8JS8xiiPxsEcKB6z97pZsSs1F_rS0zBS245ZV3ifxa1T9QMqJSCh87kJqM2oeEGJD1rFGx9AGG0Yr8XMwXg8tB1uIZGXg-GV_2Zj-d92rvvbm9yQLArWWy0WXgScl5-UNQw75W3kSR2UWsj50dTfWs4596lsuWAgxrlXvLORzt5C9_bN6ngXDUoZ4WdZIS6x8VsG63r1yoEATfPuZD56z-7rk4ijPn9SkEozCjG0KSybTBWVXfhX2XwewmcdW1X212my02BdKnWig-BeF-cyW_6sCMdt7FZclhmYygIBeOvzklmSUeAKEW78RRUZHzvcmKYjaT8iLrWjzlU_DvuVGi1EGG9AjP3IigqfV3dtsNBdmGf3rwW3OILxu8UE0Q33F6-d8OpzInf6ujFd1G-8XnT5ii5xsz1sjRh8BkGjZBcw3MMwN2EXJg5S_7-fzTQxzu8wWmQGAzeTJNZqqzR-GLuIZ2RJ4Z6Qj5AdKHf4FXBRwI7eV4KrBny4G9D4eT3oUDCGOQsoN3p0MviZS2h0D0VdM-OCSnCrID1fC7TzbLPwLVDNuuuh-ANbdn0q1JuWDpdjWL2Ag';
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
