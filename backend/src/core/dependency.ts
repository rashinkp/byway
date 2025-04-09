import { PrismaClient } from "@prisma/client";
import { AuthController } from "../modules/auth/auth.controller";
import { AuthService } from "../modules/auth/auth.service";
import { AuthRepository } from "../modules/auth/auth.repository";
import { InstructorController } from "../modules/instructor/instructor.controller";
import { InstructorRepository } from "../modules/instructor/instructor.repository";
import { InstructorService } from "../modules/instructor/instructor.service";
import { UserService } from "../modules/user/user.service";
import { UserController } from "../modules/user/user.controller";
import { UserRepository } from "../modules/user/user.repository";
import { OtpRepository } from "../modules/otp/otp.repository";
import { OtpService } from "../modules/otp/otp.service";
import { OtpController } from "../modules/otp/otp.controller";


export const initializeDependencies = () => {
  
  const prisma = new PrismaClient();
  
  //otp related dependancies
  const otpRepository = new OtpRepository(prisma);
  const otpService = new OtpService(otpRepository);
  const otpController = new OtpController(otpService);


  const authRepository = new AuthRepository(prisma , otpService);
  const authService = new AuthService(authRepository);
  const authController = new AuthController(authService);


  const instructorRepository = new InstructorRepository(prisma); 
  const instructorService = new InstructorService(instructorRepository);
  const instructorController = new InstructorController(instructorService); 

  //user dependancy
  const userRepository = new UserRepository(prisma);
  const userService = new UserService(userRepository);
  const userController = new UserController(userService); 



  return { authController , instructorController , userController, otpController };
}

