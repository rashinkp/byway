export interface ApiError {
  message: string;
  statusCode?: number;
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
    status?: number;
  };
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    isVerified: boolean;
  };
  accessToken?: string;
  refreshToken?: string;
}
