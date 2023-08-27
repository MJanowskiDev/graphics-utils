import { AxiosError } from 'axios';

interface ApiException {
  statusCode: number;
  message: string[];
  error: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  hostType: string;
  exception: ApiException;
}

export type ApiErrorResponse = AxiosError<ApiError>;
