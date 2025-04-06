import { AuthRepository } from "./auth.repository";
import * as bcrypt from "bcrypt";
import { JwtUtil } from "../../utils/jwt.util";

export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  async registerAdmin(name: string, email: string, password: string) {
    console.log("Registering admin with email:", email);
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }

    const existingUser = await this.authRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.authRepository.createAdmin(name, email, hashedPassword);
  }

  async login(email: string, password: string) {
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (user.authProvider !== "EMAIL_PASSWORD" || !user.password) {
      throw new Error("This account uses a different authentication method");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate token here and return it (or move this to controller)
    const token = JwtUtil.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    return { user, token };
  }
}
