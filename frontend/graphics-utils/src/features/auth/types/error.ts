interface AuthException {
    statusCode: number;
    message: string[];
    error: string;
  }
  
  export interface AuthError {
    statusCode: number;
    message: string;
    timestamp: string;
    path: string;
    hostType: string;
    exception: AuthException;
  }