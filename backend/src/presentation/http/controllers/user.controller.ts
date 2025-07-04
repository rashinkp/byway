import { IGetAllUsersUseCase } from "../../../app/usecases/user/interfaces/get-all-users.usecase.interface";
import { IToggleDeleteUserUseCase } from "../../../app/usecases/user/interfaces/toggle-delete-user.usecase.interface";
import { IGetCurrentUserUseCase } from "../../../app/usecases/user/interfaces/get-current-user.usecase.interface";
import { IGetUserByIdUseCase } from "../../../app/usecases/user/interfaces/get-user-by-id.usecase.interface";
import { IUpdateUserUseCase } from "../../../app/usecases/user/interfaces/update-user.usecase.interface";
import { IGetPublicUserUseCase } from "../../../app/usecases/user/interfaces/get-user-public.usecase.interface";
import { IGetUserAdminDetailsUseCase } from "../../../app/usecases/user/interfaces/get-user-admin-details.usecase.interface";
import {
  validateGetAllUsers,
  validateGetUser,
  validateToggleDeleteUser,
  validateUpdateUser,
} from "../../validators/user.validator";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { UnauthorizedError } from "../errors/unautherized-error";
import { BadRequestError } from "../errors/bad-request-error";
import { HttpError } from "../errors/http-error";
import { BaseController } from "./base.controller";
import { getSocketIOInstance } from "../../socketio";

export class UserController extends BaseController {
  constructor(
    private getAllUsersUseCase: IGetAllUsersUseCase,
    private toggleDeleteUserUseCase: IToggleDeleteUserUseCase,
    private getCurrentUserUseCase: IGetCurrentUserUseCase,
    private getUserByIdUseCase: IGetUserByIdUseCase,
    private updateUserUseCase: IUpdateUserUseCase,
    private getPublicUserUseCase: IGetPublicUserUseCase,
    private getUserAdminDetailsUseCase: IGetUserAdminDetailsUseCase,
    httpErrors: IHttpErrors,
    httpSuccess: IHttpSuccess
  ) {
    super(httpErrors, httpSuccess);
  }

  async getAllUsers(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }
      const validated = validateGetAllUsers(request.query);
      const result = await this.getAllUsersUseCase.execute(validated);
      return this.success_200({
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
      }, "Users retrieved successfully");
    });
  }

  async toggleDeleteUser(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }
      if (!request.params.id) {
        throw new BadRequestError("User ID is required");
      }
      const validated = validateToggleDeleteUser({
        id: request.params.id,
      });
      const user = await this.toggleDeleteUserUseCase.execute(
        validated,
        request.user
      );

      // Emit real-time notification to the user
      const io = getSocketIOInstance();
      if (io) {
        const isCurrentlyDeleted = user.deletedAt ? true : false;
        const notificationType = isCurrentlyDeleted ? 'USER_DISABLED' : 'USER_ENABLED';
        const message = isCurrentlyDeleted 
          ? "Your account has been disabled by an administrator. If you believe this is a mistake, please contact support."
          : "Your account has been re-enabled. You can now access the platform again.";
        
        io.to(user.id).emit('newNotification', {
          message: message,
          type: notificationType,
          userId: user.id,
          userName: user.name || user.email,
          timestamp: new Date().toISOString()
        });
      }

      return this.success_200({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        deletedAt: user.deletedAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },  "User data updated successfully");
    });
  }

  async getCurrentUser(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }
      const { user, cartCount } = await this.getCurrentUserUseCase.execute(request.user.id);
      const { user: fetchedUser, profile } = await this.getUserByIdUseCase.execute({ userId: user.id });
      return this.success_200({
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
        cartCount,
      }, "User retrieved successfully");
    });
  }

  async getUserById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }
      if (!request.params.userId) {
        throw new BadRequestError("User ID is required");
      }
      const validated = validateGetUser({ userId: request.params.userId });
      const { user, profile } = await this.getUserByIdUseCase.execute(validated);
      if (!user) {
        throw new HttpError("User not found", 404);
      }


      return this.success_200({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: profile?.bio,
        isVerified: user.isVerified,
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
      }, "User retrieved successfully");
    });
  }

  async updateUser(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }
      const validated = validateUpdateUser(request.body);
      const { user, profile } = await this.updateUserUseCase.execute(
        validated,
        request.user.id
      );
      return this.success_200({
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
      }, "User updated successfully");
    });
  }

  async getPublicUser(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.params.userId) {
        throw new BadRequestError("User ID is required");
      }
      const validated = validateGetUser({ userId: request.params.userId });
      const { user, profile } = await this.getPublicUserUseCase.execute(validated);
      if (!user) {
        throw new HttpError("User not found", 404);
      }
      return this.success_200({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        bio: profile?.bio,
        education: profile?.education,
        skills: profile?.skills,
        country: profile?.country,
        city: profile?.city,
      }, "Public user retrieved successfully");
    });
  }

  async getUserAdminDetails(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.params.userId) {
        throw new BadRequestError("User ID is required");
      }
      const validated = validateGetUser({ userId: request.params.userId });
      const { user, profile, instructor } = await this.getUserAdminDetailsUseCase.execute(validated);
      if (!user) {
        throw new HttpError("User not found", 404);
      }
      return this.success_200({
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
        instructor: instructor ? {
          id: instructor.id,
          areaOfExpertise: instructor.areaOfExpertise,
          professionalExperience: instructor.professionalExperience,
          about: instructor.about,
          website: instructor.website,
          education: instructor.education,
          certifications: instructor.certifications,
          cv: instructor.cv,
          status: instructor.status,
          totalStudents: instructor.totalStudents,
        } : null,
      }, "User admin details retrieved successfully");
    });
  }
}
