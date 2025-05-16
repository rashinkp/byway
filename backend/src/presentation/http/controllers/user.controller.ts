import { Request, Response, NextFunction } from "express";
import { IGetAllUsersUseCase } from "../../../app/usecases/user/interfaces/get-all-users.usecase.interface";
import { IToggleDeleteUserUseCase } from "../../../app/usecases/user/interfaces/toggle-delete-user.usecase.interface";
import { IGetCurrentUserUseCase } from "../../../app/usecases/user/interfaces/get-current-user.usecase.interface";
import { IGetUserByIdUseCase } from "../../../app/usecases/user/interfaces/get-user-by-id.usecase.interface";
import { IUpdateUserUseCase } from "../../../app/usecases/user/interfaces/update-user.usecase.interface";
import { IGetPublicUserUseCase } from "../../../app/usecases/user/interfaces/get-user-public.usecase.interface";
import { ApiResponse, PublicUserResponse, UserResponse } from "../interfaces/ApiResponse";
import { validateGetAllUsers, validateGetUser, validateToggleDeleteUser, validateUpdateUser } from "../../validators/user.validator";

export class UserController {
  constructor(
    private getAllUsersUseCase: IGetAllUsersUseCase,
    private toggleDeleteUserUseCase: IToggleDeleteUserUseCase,
    private getCurrentUserUseCase: IGetCurrentUserUseCase,
    private getUserByIdUseCase: IGetUserByIdUseCase,
    private updateUserUseCase: IUpdateUserUseCase,
    private getPublicUserUseCase: IGetPublicUserUseCase
  ) {}

  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = validateGetAllUsers(req.query);
      const result = await this.getAllUsersUseCase.execute(validated);
      const response: ApiResponse<{
        items: UserResponse[];
        total: number;
        totalPages: number;
      }> = {
        statusCode: 200,
        success: true,
        message: "Users retrieved successfully",
        data: {
          items: result.items.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            deletedAt: user.deletedAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          })),
          total: result.total,
          totalPages: result.totalPages,
        },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async toggleDeleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = validateToggleDeleteUser({
        id: req.params.id,
        deletedAt: req.body.deletedAt,
      });
      const user = await this.toggleDeleteUserUseCase.execute(validated, req.user!);
      const response: ApiResponse<UserResponse> = {
        statusCode: 200,
        success: true,
        message: validated.deletedAt === "true" ? "User deleted successfully" : "User restored successfully",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          deletedAt: user.deletedAt,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.getCurrentUserUseCase.execute(req.user!.id);
      const { user: fetchedUser, profile } = await this.getUserByIdUseCase.execute({ userId: user.id });
      const response: ApiResponse<UserResponse> = {
        statusCode: 200,
        success: true,
        message: "User retrieved successfully",
        data: {
          id: fetchedUser.id,
          name: fetchedUser.name,
          email: fetchedUser.email,
          role: fetchedUser.role,
          avatar: fetchedUser.avatar,
          bio: profile?.bio,
          education: profile?.education,
          skills: profile?.skills,
          phoneNumber: profile?.phoneNumber,
          country: profile?.country,
          city: profile?.city,
          address: profile?.address,
          dateOfBirth: profile?.dateOfBirth,
          gender: profile?.gender,
          deletedAt: fetchedUser.deletedAt,
          createdAt: fetchedUser.createdAt,
          updatedAt: fetchedUser.updatedAt,
        },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = validateGetUser({ userId: req.params.userId });
      const { user, profile } = await this.getUserByIdUseCase.execute(validated);
      const response: ApiResponse<UserResponse> = {
        statusCode: 200,
        success: true,
        message: "User retrieved successfully",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          bio: profile?.bio,
          education: profile?.education,
          skills: profile?.skills,
          phoneNumber: profile?.phoneNumber,
          country: profile?.country,
          city: profile?.city,
          address: profile?.address,
          dateOfBirth: profile?.dateOfBirth,
          gender: profile?.gender,
          deletedAt: user.deletedAt,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = validateUpdateUser(req.body);
      const { user, profile } = await this.updateUserUseCase.execute(validated, req.user!.id);
      const response: ApiResponse<UserResponse> = {
        statusCode: 200,
        success: true,
        message: "User updated successfully",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          bio: profile?.bio,
          education: profile?.education,
          skills: profile?.skills,
          phoneNumber: profile?.phoneNumber,
          country: profile?.country,
          city: profile?.city,
          address: profile?.address,
          dateOfBirth: profile?.dateOfBirth,
          gender: profile?.gender,
          deletedAt: user.deletedAt,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getPublicUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = validateGetUser({ userId: req.params.userId });
      const { user, profile } = await this.getPublicUserUseCase.execute(validated);
      const response: ApiResponse<PublicUserResponse> = {
        statusCode: 200,
        success: true,
        message: "Public user retrieved successfully",
        data: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          bio: profile?.bio,
        },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}