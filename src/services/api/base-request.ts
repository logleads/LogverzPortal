import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token =
  'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE3MjYyOTg1MDksImV4cCI6MTcyNjMyNzMwOX0.jYp8lf_BlC6sruDGs0H_pAyGUJ2LVP82QClNar5UgWAdgFAKr5qG-aG4VIIf1FC7bS0GnjCUZWHjbOwEa5rIP5qfrcCRaizBsqPxZjam9jtzqVSMRetYV5Ojkfyz3k1DJjawZ7-H-ADeMfEJ7R1sn4WOUyowJ_ctvFYlol-7VhLcMnoSlWcgG9Dt_l5W-oY7k9D1SFhEAPPHK7wXFVFyjDHqAgm5aBYT8cTp9MXzyz8nIFWfoy-ijH-aV3G56bz_sn1sNofbBd3vXZQqIbe7K158CbQomYw1yEBoJMWbLr642SNftjcbGxEw2ZTdCguPBQYzGZVqywqPwjflACoyxxorNwP7VvqE2sDMK-v5Ck7RIWv7l-n4PhmIiZbA-QkiBQcinPZ0s1FAdX38KT0eO4vj0PWtnxZDTJRA3bOHY9FoDO0yyCkdioShZc8-b8MjmZ-1MB_sp75QH2MhskZWhJme21VEnQDvegONwcfCXao1zyUKvz9CM8k4NJDAB4_IhXxu-Dq4Wh2G9Twi7L9o6ceewBFFFc1FmV5B3jdRI4uEVu36TebPXF3HzRFegfEepiwpafVvUFgqs5yLtaMSF-pDg0Sx7UY7YRgbrAfbcZMpg6R_HuHt-mp1peginfLoeOr2iVVxwzkg2Q7jkkyoWjV8WRWkctFzwBjkFieHbUw';
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
