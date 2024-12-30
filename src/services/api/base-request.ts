import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { BASE_URL, DEVELOPMENT_MODE } from '~/constants';

export const token ='eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQVdTOmJpbGFsLmF3YW4iLCJpYXQiOjE3MzU1NjkyMDYsImV4cCI6MTczNTU5ODAwNn0.FH75e70PWwL9NoRMTFOn_0PtZPBc_Zv8OpAvmvQRZDwIhfM8t6NelrsH_mMgRTEvC2LFxomx48aRihN5nkXX8m6siuvk6OMGLfPe1LE-ge-wb-RQI-XdGCuKeeTe8jbPzDDOY6qHLKfbWYHgUUtuQbMBXDN-N98B1o5UZIP1RzbwSnoaW35r3J4pmj7viWe4qpBJJAkxmPt_w6A2iCn2OTfIPR4uoc9BPDfBWNMWG4VdnXp_HIa4_GiJNKgMgXrz40n6bsK_T4NmUak2VeyjMVyZ9s3uvJzKGunFtNbItvOwtPaRXbsOX4aWGpGRdp7LMFTyI7rXpEmxTU7FfpnolapTP1Id_NOARmfM6kdGBTu8r0IDLjKyBa5LzgxN-ifHJVJJAIXBpha-er7lCSZwI9F45DXFVfvcl0i_YuqqoRV1FvErYh8tQFqD7vRwaqG44RYwcfJO8Qh0_FeMPAoZjmIN7cpMF8p5FlqPzbo2XbGrHoLZQLpxyGpWcgh_UbP53Bhg8m2Ey94cpfIle1zvVcmgF7rTbBOgYrLrtJyA9JP1cG39vbY86fWCTlGUIQ1B8QAXHw2A1G7ZfLzICNV8IQyxxgzXG3FGK7PeiS0iw6YbqMjr5-c3f5VfDUqPQzUTl1QW9RZ5r4bXLqxAvbufiaidP-gPlBgr5CwGuJtPLjs'
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
