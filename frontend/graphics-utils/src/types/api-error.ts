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
