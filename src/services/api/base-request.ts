import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token ='eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE3MjU4OTc0NzUsImV4cCI6MTcyNTkyNjI3NX0.cbsMElseXcmvuROVh_0_vLknVSEuH-T2pgGENOZczZv4bMfwocPZuUqwWvOeGyCwspa0iKBz8qa05pfb2qGzVbZ3rz4B9jc9Pssf-2andsrSkAm9IrINk9UQjhPCUPblk3wndCFYM7X0QIpF83AEF74_fOKuWA5Rrr-Zt25Mq3as1yzY_D8pMYOFcSWX7GTwCCBB-KPC2juKXMUz9FDkbKOGKTDbrSsaZQ6UEn0_6V7w-Od_TyshPFjPp8ofux8qYMeGo_B7Us-RQakArJRSj3ib7BjT8mDNyJk7h6V3Br_DwpWbFmpjKjf1AbqGQ3srBMO31KofVz-JAFLft0OLLWfUdg9CiZsSwTqtdlBa5ESg25okNvouFwitQK0g1ZjhCnK0juEvGoP50OMMtmtMHny5sD27BNLU-U-n1HXPGH8Cg991ASHGNhk7SCzZV3QYaqDUt9O2Xvgt40PcA4Gx2rm6euwiqdVvDfadmFpueqiHEje7JSTzx5uNScXi04D6fVtuUjfXRNDkbu0_qNHwNadSpvIj7gu5WG2x0OhVn3XXOUUUmDMVdcn3sm65s1V3dmfNbYCYAv9LPX1g5Tb2lDyP5BWmugI3mbuEcuafq2R_8cva7FU4CcahVsftlLRIvn3lJXoAjoXgboLEte8PhH_mC2duDFa25lgDNYzDwCg';
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
