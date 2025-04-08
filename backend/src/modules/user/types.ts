// src/modules/user/types.ts
export interface IUser {
  id: string;
  email: string;
  role: string;
  name?: string;
  password?: string;
  avatar?: string;
}

export interface UpdateUserInput {
  userId: string;
  name?: string;
  password?: string;
  avatar?: string;
}
