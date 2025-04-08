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


export const initializeDependencies = () => {
  const prisma = new PrismaClient();
  const authRepository = new AuthRepository(prisma);
  const authService = new AuthService(authRepository);
  const authController = new AuthController(authService);


  const instructorRepository = new InstructorRepository(prisma); 
  const instructorService = new InstructorService(instructorRepository);
  const instructorController = new InstructorController(instructorService); 

  //user dependancy
  const userRepository = new UserRepository(prisma);
  const userService = new UserService(userRepository);
  const userController = new UserController(userService); 


  return { authController , instructorController , userController };
}

