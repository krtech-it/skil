import axios, { AxiosInstance } from "axios";
import { setupCache, CacheRequestConfig } from "axios-cache-interceptor";
import NProgress from "nprogress";
import { API_SOURCE, TIMEOUT_API } from "src/constants";
import { TApiParams, TResponse } from "src/services/api/types";
import { clientRoutes } from "src/routes/constants";

export class ApiService {
  private readonly axios: AxiosInstance;
  private numberOfAjaxCAllPending = 0;

  constructor() {
    const accessToken = localStorage.getItem("accessToken");
    this.axios = setupCache(
      axios.create({
        validateStatus: (status) => status >= 200 && status < 400,
        baseURL: API_SOURCE,
        timeout: TIMEOUT_API,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      })
    );

    this.axios.interceptors.request.use((config) => {
      this.numberOfAjaxCAllPending++;
      NProgress.start();
      const accessToken = localStorage.getItem("accessToken");
      config = {
        ...config,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      };
      return config;
    });

    this.axios.interceptors.response.use(
      (response) => {
        this.numberOfAjaxCAllPending--;

        if (this.numberOfAjaxCAllPending === 0) {
          NProgress.done(true);
        }

        return response;
      },
      (error) => {
        this.numberOfAjaxCAllPending--;

        if (this.numberOfAjaxCAllPending === 0) {
          NProgress.done(true);
        }
        if (error.response.status === 403) {
          window.location.href = clientRoutes.auth.path;
        }
        if (error.response.data.detail) {
          return Promise.reject(error.response.data.detail);
        }

        return Promise.reject(error);
      }
    );
  }

  readonly get = <T, P = TApiParams>(
    path: string,
    params?: P,
    config?: CacheRequestConfig
  ): TResponse<T> =>
    this.axios.get<T>(path, {
      ...config,
      params,
      paramsSerializer: {
        indexes: null
      }
    });

  readonly post = <T, D>(
    path: string,
    data: D,
    config?: CacheRequestConfig
  ): TResponse<T> => this.axios.post(path, data, config);

  readonly put = <T, D>(
    path: string,
    data: D,
    config?: CacheRequestConfig
  ): TResponse<T> => this.axios.put(path, data, config);

  readonly delete = <T>(
    path: string,
    config?: CacheRequestConfig
  ): TResponse<T> => this.axios.delete(path, config);

  readonly patch = <T, D>(
    path: string,
    data: D,
    config?: CacheRequestConfig
  ): TResponse<T> => this.axios.patch(path, data, config);

  readonly sse = (path: string): EventSource =>
    new EventSource(`${API_SOURCE}${path}`);
}

export const api = new ApiService();
