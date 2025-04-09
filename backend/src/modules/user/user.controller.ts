import { ApiResponse } from "../../types/response";
import { IUserWithProfile, UpdateUserInput } from "./types";
import { UserService } from "./user.service";

export class UserController {
  constructor(private userService: UserService) {}

  async updateUser(
    input: UpdateUserInput
  ): Promise<ApiResponse<IUserWithProfile>> {
    try {
      const updatedData = await this.userService.updateUser(input);
      return {
        status: "success",
        data: updatedData, 
        message: "User updated successfully",
        statusCode: 200,
      };
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
