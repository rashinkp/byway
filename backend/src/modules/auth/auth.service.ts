import { JwtUtil } from "../../utils/jwt.util";
import { IAuthRepository } from "./auth.repository";
import * as bcrypt from "bcrypt";

export interface IAuthUser {
  id: string;
  email: string;
  role: string;
  password?: string;
  authProvider?: string;
}

export class AuthService {
  constructor(private authRepository: IAuthRepository) {}

  async registerAdmin(
    name: string,
    email: string,
    password: string
  ): Promise<{user:IAuthUser , token:string}> {
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }

    const existingUser = await this.authRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.authRepository.createAdmin(name, email, hashedPassword);
    const token = this.generateToken(user.id, user.email, user.role);
    return { user, token };
  }

  async registerUser(name: string, email: string, password: string): Promise<{ user: IAuthUser, token: string }> {
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }

    const existingUser = await this.authRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.authRepository.createUser(name, email, hashedPassword);
    const token = this.generateToken(user.id, user.email, user.role);
    return { user, token };
  }

  async login(email: string, password: string): Promise<{ user: IAuthUser; token: string }> {
    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (user.authProvider !== "EMAIL_PASSWORD" || !user.password) {
      throw new Error("This account uses a different authentication method");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
      throw new Error("Invalid email or password");
    }
    return { user, token: this.generateToken(user.id, user.email, user.role) };
  }


  private generateToken(id: string, email: string, role: string): string {
    return JwtUtil.generateToken({ id, email, role });
  }
}
