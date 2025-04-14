export interface IUser {
  id: string;
  email: string;
  role: "USER" | "INSTRUCTOR" | "ADMIN";
}
