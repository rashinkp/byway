import { ApiResponse } from "../../types/response";
import { IUser, UpdateUserInput } from "./types";
import { UserService } from "./user.service";


export class UserController {
  constructor(private userService: UserService) { }

  async updateUser(input: UpdateUserInput): Promise<ApiResponse<IUser>> {
    try {
      const updatedUser = await this.userService.updateUser(input);
      return { 
        status: 'success',
        data: {
          id: updatedUser.id,
          email: updatedUser.email,
          role: updatedUser.role
        },
        message: 'User updated successfully',
        statusCode:200,
      }
    } catch (error) {
      console.error(error);
      return {
        status: "error",
        message: error instanceof Error ? error.message : "User update failed",
        statusCode: 400,
      };
    }
  }


}