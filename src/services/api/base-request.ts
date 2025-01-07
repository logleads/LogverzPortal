import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token ='eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE3MzYyNjk1OTEsImV4cCI6MTczNjI5ODM5MX0.a_cKhWQYnJvcl94HKkVSC3U60mNIdqKP1nf1AhrbVDI5UZklbo5uMoRzxvfu95UgI-uv_C70LC9l2VR2UnkFITKWUdpYB4YVenEn7zh9_c2xN9CpZDMQq3GP6g_6-xNel9fzNNWulMUoZKGzfXl8AywVFhcVolRnRWAYei2GMauzyDEP5KZyCIam4Gcr0drXYpdxKbtLRRA8Iw5yz9X2eCdONsY_mtqJq9E86qmM3i1iyFpQ3gF4V1YEJXKofoCp_s7xUUFT--ZKq5Makhv3sJsLkoKCLC0lrtVIYuKAiNgc8up1V0hMIHk_p71se-RG3UaZhoW8vbxpnDcK8KCnQK7GqEhCo9WL-RPWAGzbA7MVR3BQ-lM__EMe_HphYnOuXVUHUpKZOWrZrhDFg_UqLtAhh01SLfZyZJfxemBASkWnUldB5PtnjKdsCcZIvNwZF8hqXOFeaF9FS8-srcFxh_zea8sSqyWTnQiAWSVu2zc_OvT9HB39oY6b0sXfdT3SfP-HuEAx6XHyVaMfiGlw5G-RrFjzZOnz4IYLjf3UXiMrcJEusfWPQVaq9QjMFViHnxrv0zedjJ79u6WkdaDN1Y_slmVjeglMs83Wt4QSSQm8U8UxjJcGS7WUwbFMl39Xtu1IX_gKR5SXs8UtT6mcsN2LY3KjAfST4HQ5eFO064c'
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
