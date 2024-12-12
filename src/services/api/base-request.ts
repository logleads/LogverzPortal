import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token =
  'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmFkbWluIiwiaWF0IjoxNzMzOTY0NTE1LCJleHAiOjE3MzM5OTMzMTV9.rX4c4sv60VdiToXeFE7vuVRmkANGsB0kxFJGoKqQR4_JRVTrNN94Y1MV_ohZHBFJH4ErlkJzZbHP48UTByEHpkMV7jxDd_yYzJzY8LOP4NPPmiTY-8XTPj_MB28m4jQKcnMtJbNILsUFbs16s6X6u1pX6XDX-thvoWW98bSBlFxwroyWrLY0r6KIGXa9gVnBdHHMFl2apTkLRapFcJgBzIzrh9sE9N9BCThL_orTIafLnKPIERuXzyflHLi5FlQtpvT3rS2bOt9myAHIGDnFtDJ7GHarkncZWJD-lBoMHFPF7RPeFzkuTjW0F5OuqrmPysemL_XydCsRpaAcOn_Ymk2jw9jJWMXkYQ-515WeuCk31xfS7A_hIibQ8Qq3qGibJEMhL2xy0_zIndm3lqWeU-h-0MZuUTzEWmc1agsZBrqfmx72WirNVef45mT2pJ87nUZxD2oQZYxc2tHFsW-5co6ueAItqxdOGmaSUm57O8rg_NH8EFg4PN0bXyMTahy_I-b7vtx8aFp5ompFQ6gkFAbwt-6WXG2OKGBiQArfD6Pgt6imf6gVWsDofM7HjAbIWXmaWKho846qBAMO3hUnrd-E3961U-ZANOoqiXiS6a9ZDuVuNZT-poK-GskHw4p6sFAEYIQNy1R_W-a2rNI1apXYhxkX6MClCzu2_-SsnJI';
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
