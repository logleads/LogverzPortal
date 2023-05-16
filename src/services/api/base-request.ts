import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token =
  'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE2ODQyNDQxNjUsImV4cCI6MTY4NDI3Mjk2NX0.IHNJ9Vm7fktME1b4vgpvUttDrSJbBBsLlOtqlKAbwXB6d_IedxMARuiOCiC-v0OwIzM9c_mMd0Gb4KXwbeaLGhkFAHEzBikZIspuqU1gIiwfQGSQ3giDLIhb2neHq0QeJ86TczRKnMJSIyirUZE4aW0lQXRvIY8J9V1xy4n4a3e4Byd_9ekCeedSw3b6XBxDLwIhkOVeY85sikqVsZKhJA-WSgU4dp2hFFIOdI5MyXBVeiEMzHphp6V6xJqe6c7qhmh4jF9UXG408-kT-Z5UhvvbWNU9nL_lhM7xg3mpiaKy4kaVqK8dhyNXJdRPWqgfh3SBdk3JFdQO0RHnHIT9Us0-BvmDeWuDdFqAzBNSOBQLgjmKb_PxtNPOcLTCIEirPMSjdPXvaWnAYBepSsZ2SK6J6h-6mGK6BxQgNYAMjo14je-H2lqnuIlbe6MOYbRIIIY0nRDx3qhXpeZXIdnqn3ouZV3LSpZ6NziASMBBgTFHfPi-Z9CEA4xvFHsXLSsd2BrQTpkOOSikZIjAz68JgIsVN46LgM71W7hadSypryx--70QnI6azsk59nWPQJL-0rsngYuhUzoec1uKwU5lp-HzIOhkAZLBiKrbZUegVi7xCWJwjq9sV8ada54jXVBb7h9eFgZWuWIGQriRTA1gmugJZCH0mrFZUREDnBEdOEg';
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
