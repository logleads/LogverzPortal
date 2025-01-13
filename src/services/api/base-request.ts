import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token ='eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJOYW1lIjoiYmlsYWwuYXdhbiIsIlR5cGUiOiJVc2VyQVdTIiwiRG9tYWluIjoiQVdTIiwiaWF0IjoxNzM2NzkyNTQ5LCJleHAiOjE3MzY4MjEzNDl9.GrND3s_M4vGhBw2oxqJaP_p5gcv03eR8D02sjMIRcVy0Ht34DIW7BRMHMxcgYJI5Hn9lSxzNn_oizWp4-AYEk06jvjC0DQn0pe9gY1_1SG7i_7xkPtzb2Dy7Bv2DqpQxF0zLkzd1NzDWxpR1aA1SSSXmTFrG0rbLTrIAXkroq-VojfoX7yJoFJttFwsTuWn1IZxfPVMu-_sKNhaBHl6NDXqWbpouaVTyDkPyGzisdN-iCcSGDiZP45ppYPAbJOlNXr3ErIlVs1bUWYZ1ciOfVlczCGTxnb4aWSfi3f5oHZnTqZGVEh-4hyUMPx0i8XQjBt_Saxi3cMDajVsSMXAPmgTswbgYWrYwXwYf2rtdPamhmzQhUiIBomFcvwe1KUzDvTje_1OlzD_JH1Zw7iAyXGKUGsxqsiGft5qi-PS3_myADTNeivaWDr_WI_j-vy8EFarb8AVYzryKno3j6ic3xnEBzsJaL3bzcmtwQD6q1Hpgy_wjO1Bk1h6uyk9uuXJJMfE1571tt6oNcu2Cg3IaOZUVRXjpejN9rNl3tOai6MzkoExwNTjvDWprCrR1T-tdoDODvUjghOAvxp0rQhb3_gKU8Ckml2O46LlvFF9M7auZlpwHm1kRaHJCxMg4dcr2wRKBhGcJQTfdOSNPgOq26dqzLmLjX-nFMR6_nPn96Nk'
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
