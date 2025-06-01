import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token ='eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJOYW1lIjoiYWRtaW4iLCJUeXBlIjoiVXNlckFXUyIsIkRvbWFpbiI6IkFXUyIsImlhdCI6MTc0ODczMzE5MiwiZXhwIjoxNzQ4NzYxOTkyfQ.oIWxqgJ4QPOLYr4E-xemct1BjGRhsTmGAXx0aokngpT2xceuAQYX_vzS6o6MEorCGZ6iC5Kz7Tj5SMcJHnL4Fa4pHZZuqT937CJmdJ175hB4SgzgqYSHPT5l9xKNbUUkJu0Ms-Ee5Gyu4k4XE5qI5OR0RsVDzEiU4cfvA5vrLxpM5Ze-Ib4DMv_to0-m-0rYtyHVbpFxoQ7uJI3jCIu-oNG1Czicau5yvEhuJGyfG9fkgYjle_cCbPsBNWndH8wzfnLpGiSMjVr2mntpnlhW7PwIz-nS6J2zkGDlVYHeEKAUH0J7hJ4M7wCvhRgdzlI38Qahkf3cdORlGeRo1wCrY1A_Si_EP0rPoSQYRNG-umrpzaEX2Kq3pfTWf6XqucBChH_T832TGGt8nS7U4sro_vAPH_l6nX8sndJgPMSLgdkhqdQa4YUy5mQneTHGXoAcARdRQx0HOuLir6pUur-h4iSqRWLdhC09yvI71o1_FfekW5u2cUf6iS9gcQoc-32i1EVmRph41csEwLmsu4UFpLzu2Kg0ePQ4bQ1B9bCew1z-GqLCTLWNLp2DhHbCQRr_03kgESI4zYa2OsynCErig9KyeFEzrdV8kJB35ubB-D-xOetXILDSVd8OIzT40Uv5vvfixAW0LT6qs1C_WVZcYZn_4aQi6fDvB7H5eupktjU';
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
