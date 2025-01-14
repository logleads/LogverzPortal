import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token ='eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJOYW1lIjoiYmlsYWwuYXdhbiIsIlR5cGUiOiJVc2VyQVdTIiwiRG9tYWluIjoiQVdTIiwiaWF0IjoxNzM2ODkyMDc1LCJleHAiOjE3MzY5MjA4NzV9.T3BuFLucVgYc1xvFnxHIvaZzLPI9RTaYV3NK6rQ4mo37drrcZmsSX8FaT3R30pIf6gAsQ6SUu0zIIw7xQDjk57mghOLQazt5fkr786nQCO-xpRhYcJr132hpK79DvJ-qqG3x04LBhL_f8pjk3TX9QtE5PLqm1EGErYdCs5qods0hC5PSEZokSK9__OMjMzS8Gjb3kNF_bPHIW2Y1b5tkWpqsxA9UP5tlnjlKFd1shjYseiN_2gt-KtxeBlOZu6fQST4EvkyQJribdcwkg128mlXO1FmpxXhFwhO7UlheKkdcNC-5R7ss4z3ZjoAruHAHHqZKPG8Z5TJqMPocSgZGXEDQA6y7hnJlHQWweT4Nd-7N2SxHpzlkkY255MvQrmKRBU1PkXpeLhbGxx-oWUBxm4ivMDSW1_3YEWZLPJ05ao4-1ZaHov17kyLdiEOLnN3RBVofGZfji3Fj10dDBVNx-7icuFwYQ2K4VR8nuRh_rNYqy0FDnmbCrubnE5JY-cxAOdlP_tzhxLXdq5ub30sI5XAk8rFUOuihfrEfmtvo1fUqWFwlZuRN2gI1ElcTAIbdy8bEJyMoR3WX5AHXmKK8mnOd01u-cb_BShJXf5NIWHgAWS0LMPsyn4XNndh1i91btEy4f8M1tQkazOho1QLjGOfGTRHPesPYuhB83h60Zoo'
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
