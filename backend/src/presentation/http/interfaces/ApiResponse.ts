export interface ApiResponse<T = any> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  education?: string;
  skills?: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  address?: string;
  dateOfBirth?: Date;
  gender?: string;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PublicUserResponse {
  id: string;
  name: string;
  avatar?: string | null;
  bio?: string | null;
  education?: string | null;
  skills?: string | null;
  country?: string | null;
  city?: string | null;
}
