import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../../types/response";
import { AdminUpdateUserInput, IGetAllUsersInput, IUserWithProfile, UpdateUserInput } from "./types";
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

  async getAllUsers(input: IGetAllUsersInput): Promise<ApiResponse> {
    try {
      const result = await this.userService.getAllUsers(input);
      return {
        status: "success",
        data: result,
        message: "Users retrieved successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      console.error(error);
      return {
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to retrieve users",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async updateUserByAdmin(
    input: AdminUpdateUserInput
  ): Promise<ApiResponse> {
    try {
      await this.userService.updateUserByAdmin(input);
      return {
        status: "success",
        data: null,
        message: "User soft-deleted successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      return {
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to update user",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
  }
}
