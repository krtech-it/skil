import { AxiosResponse } from "axios";

export type TApiParams = Record<string, string | boolean | number | null>;
export type TResponse<T> = Promise<AxiosResponse<T>>;
