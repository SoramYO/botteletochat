import { AxiosError } from 'axios';

export interface ApiResponse<T> {
  ok: boolean;
  result: T;
  description?: string;
}

export interface ApiError {
  code: number;
  message: string;
  description?: string;
}

export type ApiErrorHandler = (error: AxiosError<ApiError>) => never;