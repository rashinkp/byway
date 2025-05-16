export interface IUpdateUserRequestDTO {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  avatar?: string;
  isVerified?: boolean;
  deletedAt?: Date;
}
