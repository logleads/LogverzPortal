import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token ='eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJOYW1lIjoiYmlsYWwuYXdhbiIsIlR5cGUiOiJVc2VyQVdTIiwiRG9tYWluIjoiQVdTIiwiaWF0IjoxNzM2ODcwODU5LCJleHAiOjE3MzY4OTk2NTl9.ed6X3LHTBcmSURNDo6jE4EWGw5x757moiLdTgmqeJGhyywjXcPqiGnuP9YXmZGEFG0IinzkANiYInIsAgf-7QQM7jtEJUGcPcUVNyC0S4QMoV_bXjLgDOz2FfGFT08CUMmYeJUI6JzsTIGK_GgTV5Pp-G1O3x6XyTR9x2YnTDnRjCIJEfcca3t2BkkRP08CFiQpVgs_CcU-tEFhBFfMvu4gDcGZamOkO6OlaqoTonqZ06r2zW3tsc7Gjxumar_qeL61U4mGKKvv18auiSkFH1L7Zo1E_89emvK4FlragkLZexat1JiEQ9TV_r_7Mb5wqo-IbE0omK82on1n40DS29STt3QjgUdjkdv0vDB0C-I_ElEQ7k3lc0N5n6zseE2F6lm3m3OIadrOfEiUnap-CZ_i47C0sbTcqif9bUtlGYycCVLzZ3HPzofE5_HyhxdIzwtvw5snpF7myVTmklrO9deais7JVdhGh2w_1aeSVTBeLuImk7Yiz23tOmmSkyDl_Ggk313nQegQwElul1yOnxyLr97MzICpUtw4OnewZ7JExKCR_y3PFG5TxU9DC9mokwDR2JuN6b9KiraFbl2RlLpcc9sjDwTFScIOC1PPWb1DPlxPFmGKILADNHHiCXRCOPmzrSuJBw0DQqj6PCDcer2rlavbt_nMsXdAecRwZsA4'
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
