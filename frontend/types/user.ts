export interface User {
  id: string;
  email: string;
  role: "USER" | "INSTRUCTOR" | "ADMIN";
}