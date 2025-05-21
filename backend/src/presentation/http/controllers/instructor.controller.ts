
import { IUserRepository } from "../../../app/repositories/user.repository";
import {
  validateApproveInstructor,
  validateCreateInstructor,
  validateDeclineInstructor,
  validateGetAllInstructors,
  validateGetInstructorByUserId,
  validateUpdateInstructor,
} from "../../validators/instructor.validators";
import { ApiResponse } from "../interfaces/ApiResponse";
import { InstructorResponseDTO } from "../../../domain/dtos/instructor/instructor.dto";
import { APPROVALSTATUS } from "../../../domain/enum/approval-status.enum";
import { ICreateInstructorUseCase } from "../../../app/usecases/instructor/interfaces/create-instructor.usecase.interface";
import { IUpdateInstructorUseCase } from "../../../app/usecases/instructor/interfaces/update-instructor.usecase.interface";
import { IApproveInstructorUseCase } from "../../../app/usecases/instructor/interfaces/approve-instructor.usecase.interface";
import { IDeclineInstructorUseCase } from "../../../app/usecases/instructor/interfaces/decline-instructor.usecase.interface";
import { IGetInstructorByUserIdUseCase } from "../../../app/usecases/instructor/interfaces/get-instructor-by-Id.usecase.interface";
import { IGetAllInstructorsUseCase } from "../../../app/usecases/instructor/interfaces/get-all-instructors.usecase.interface";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { UnauthorizedError } from "../errors/unautherized-error";
import { HttpError } from "../errors/http-error";
import { BadRequestError } from "../errors/bad-request-error";

export class InstructorController {
  constructor(
    private createInstructorUseCase: ICreateInstructorUseCase,
    private updateInstructorUseCase: IUpdateInstructorUseCase,
    private approveInstructorUseCase: IApproveInstructorUseCase,
    private declineInstructorUseCase: IDeclineInstructorUseCase,
    private getInstructorByUserIdUseCase: IGetInstructorByUserIdUseCase,
    private getAllInstructorsUseCase: IGetAllInstructorsUseCase,
    private userRepository: IUserRepository,
    private httpErrors: IHttpErrors,
    private httpSuccess: IHttpSuccess
  ) {}

  async createInstructor(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }
      const validated = validateCreateInstructor(httpRequest.body);
      const instructor = await this.createInstructorUseCase.execute(
        { ...validated, userId: httpRequest.user.id },
        httpRequest.user
      );
      const user = await this.userRepository.findById(httpRequest.user.id);
      if (!user) {
        throw new HttpError("User not found", StatusCodes.NOT_FOUND);
      }
      const response: ApiResponse<InstructorResponseDTO> = {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Instructor application submitted successfully",
        data: {
          id: instructor.id,
          userId: instructor.userId,
          areaOfExpertise: instructor.areaOfExpertise,
          professionalExperience: instructor.professionalExperience,
          about: instructor.about,
          website: instructor.website,
          status: instructor.status as APPROVALSTATUS,
          totalStudents: instructor.totalStudents,
          createdAt: instructor.createdAt,
          updatedAt: instructor.updatedAt,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
          },
        },
      };
      return this.httpSuccess.success_201(response);
    } catch (error) {
      if (
        error instanceof ZodError ||
        error instanceof BadRequestError ||
        error instanceof UnauthorizedError
      ) {
        return this.httpErrors.error_400();
      }
      if (error instanceof HttpError) {
        return {
          statusCode: error.statusCode,
          body: {
            statusCode: error.statusCode,
            success: false,
            message: error.message,
            data: null,
          },
        };
      }
      return this.httpErrors.error_500();
    }
  }

  async updateInstructor(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }
      const validated = validateUpdateInstructor(httpRequest.body);
      const instructor = await this.updateInstructorUseCase.execute(
        validated,
        httpRequest.user
      );
      const user = await this.userRepository.findById(httpRequest.user.id);
      if (!user) {
        throw new HttpError("User not found", StatusCodes.NOT_FOUND);
      }
      const response: ApiResponse<InstructorResponseDTO> = {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Instructor updated successfully",
        data: {
          id: instructor.id,
          userId: instructor.userId,
          areaOfExpertise: instructor.areaOfExpertise,
          professionalExperience: instructor.professionalExperience,
          about: instructor.about,
          website: instructor.website,
          status: instructor.status as APPROVALSTATUS,
          totalStudents: instructor.totalStudents,
          createdAt: instructor.createdAt,
          updatedAt: instructor.updatedAt,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
          },
        },
      };
      return this.httpSuccess.success_200(response);
    } catch (error) {
      if (
        error instanceof ZodError ||
        error instanceof BadRequestError ||
        error instanceof UnauthorizedError
      ) {
        return this.httpErrors.error_400();
      }
      if (error instanceof HttpError) {
        return {
          statusCode: error.statusCode,
          body: {
            statusCode: error.statusCode,
            success: false,
            message: error.message,
            data: null,
          },
        };
      }
      return this.httpErrors.error_500();
    }
  }

  async approveInstructor(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }
      const validated = validateApproveInstructor(httpRequest.body);
      const instructor = await this.approveInstructorUseCase.execute(
        validated,
        httpRequest.user
      );
      const response: ApiResponse<{ id: string; status: string }> = {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Instructor approved successfully",
        data: {
          id: instructor.id,
          status: instructor.status,
        },
      };
      return this.httpSuccess.success_200(response);
    } catch (error) {
      if (
        error instanceof ZodError ||
        error instanceof BadRequestError ||
        error instanceof UnauthorizedError
      ) {
        return this.httpErrors.error_400();
      }
      return this.httpErrors.error_500();
    }
  }

  async declineInstructor(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }
      const validated = validateDeclineInstructor(httpRequest.body);
      const instructor = await this.declineInstructorUseCase.execute(
        validated,
        httpRequest.user
      );
      const response: ApiResponse<{ id: string; status: string }> = {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Instructor declined successfully",
        data: {
          id: instructor.id,
          status: instructor.status,
        },
      };
      return this.httpSuccess.success_200(response);
    } catch (error) {
      if (
        error instanceof ZodError ||
        error instanceof BadRequestError ||
        error instanceof UnauthorizedError
      ) {
        return this.httpErrors.error_400();
      }
      return this.httpErrors.error_500();
    }
  }

  async getInstructorByUserId(
    httpRequest: IHttpRequest
  ): Promise<IHttpResponse> {
    try {
      if (!httpRequest.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }
      const validated = validateGetInstructorByUserId({
        userId: httpRequest.user.id,
      });
      const instructor = await this.getInstructorByUserIdUseCase.execute(
        validated
      );
      const user = await this.userRepository.findById(httpRequest.user.id);
      if (!user) {
        throw new HttpError("User not found", StatusCodes.NOT_FOUND);
      }
      const response: ApiResponse<InstructorResponseDTO | null> = {
        statusCode: StatusCodes.OK,
        success: true,
        message: instructor
          ? "Instructor retrieved successfully"
          : "Instructor not found",
        data: instructor
          ? {
              id: instructor.id,
              userId: instructor.userId,
              areaOfExpertise: instructor.areaOfExpertise,
              professionalExperience: instructor.professionalExperience,
              about: instructor.about,
              website: instructor.website,
              status: instructor.status as APPROVALSTATUS,
              totalStudents: instructor.totalStudents,
              createdAt: instructor.createdAt,
              updatedAt: instructor.updatedAt,
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
              },
            }
          : null,
      };
      return this.httpSuccess.success_200(response);
    } catch (error) {
      if (
        error instanceof ZodError ||
        error instanceof BadRequestError ||
        error instanceof UnauthorizedError
      ) {
        return this.httpErrors.error_400();
      }
      if (error instanceof HttpError) {
        return {
          statusCode: error.statusCode,
          body: {
            statusCode: error.statusCode,
            success: false,
            message: error.message,
            data: null,
          },
        };
      }
      return this.httpErrors.error_500();
    }
  }

  async getAllInstructors(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validated = validateGetAllInstructors(httpRequest.query);
      const result = await this.getAllInstructorsUseCase.execute(validated);
      const response: ApiResponse<{
        items: InstructorResponseDTO[];
        total: number;
        totalPages: number;
      }> = {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Instructors retrieved successfully",
        data: result,
      };
      return this.httpSuccess.success_200(response);
    } catch (error) {
      if (error instanceof ZodError || error instanceof BadRequestError) {
        return this.httpErrors.error_400();
      }
      return this.httpErrors.error_500();
    }
  }
}
