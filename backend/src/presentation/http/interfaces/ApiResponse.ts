export interface ApiResponse<T = any> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

export type UserResponse = {
  id: string;
  name: string;
  email: string;
  role: string;
};
