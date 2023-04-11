import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token =
  'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE2ODEyMjQ0ODgsImV4cCI6MTY4MTI1MzI4OH0.WCjy508qNVP7jHPXNiz_3RmSMSW2Lu98wtyzQhSSxRRbtTXEtH-KQFbUqkJDT7JuhitAWg0OLAUub0lZqhr28tNCwa2eOE6f3hLDgkXbC1gts3NE_bBXyVWippAu6pdpfeYasQeBbOm_ylV1ESbOEC0xgFF3tjN5OJIBmoxsSrq2eNFGMTij8rc8jKBhbE3eQEdE8MebLZM4ETq3dz-zo4gznt8YILsLQFO35LNA91dR4llFwjCeQO2g8l7e1fbuC9YarzidRl_Fvao0YRy2EpKXM_aK8jIRNzJcENjtSa0SJz8Sw3ACpjZ0jZpY08Fv-YqCHSNoWix2b0k5-AasiJXwYlONmBmEVPkFBEMUXjCJrljHEbgMyYOl7ktlQsGcvc6MRfiibFKEAfxlZw9TJ8MaSIdyJ9w0LqVbdJstVuMkOE7QEiD03mUh7jDCi85lt6UrjRgTKUAnVnwNBlM38TBKyC2Z-OosWV1R5Ig0EZnGAk1729sx-ZaqHEBDlz29bG7oGdSc7cR8iiWG1o7pqWWOcGxO7LJgZOQkApYUcqb1_TwJ8ri3BouCOAusbt5ZTMqmKHPAHHE0yUomCcw2Z7-kJa6SfRbo2fdsKBUh7F4yrhSPGrPKzwrK3JWwRY5sey2Uh4BvmPv8RyOGpN8gMclqSMtswnaZrLpuyjO5o9Y';
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
