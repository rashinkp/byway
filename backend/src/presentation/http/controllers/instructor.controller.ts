import { IUserRepository } from "../../../app/repositories/user.repository";
import {
  validateApproveInstructor,
  validateCreateInstructor,
  validateDeclineInstructor,
  validateGetAllInstructors,
  validateGetInstructorByUserId,
  validateUpdateInstructor,
} from "../../validators/instructor.validators";
import { APPROVALSTATUS } from "../../../domain/enum/approval-status.enum";
import { ICreateInstructorUseCase } from "../../../app/usecases/instructor/interfaces/create-instructor.usecase.interface";
import { IUpdateInstructorUseCase } from "../../../app/usecases/instructor/interfaces/update-instructor.usecase.interface";
import { IApproveInstructorUseCase } from "../../../app/usecases/instructor/interfaces/approve-instructor.usecase.interface";
import { IDeclineInstructorUseCase } from "../../../app/usecases/instructor/interfaces/decline-instructor.usecase.interface";
import { IGetInstructorByUserIdUseCase } from "../../../app/usecases/instructor/interfaces/get-instructor-by-Id.usecase.interface";
import { IGetAllInstructorsUseCase } from "../../../app/usecases/instructor/interfaces/get-all-instructors.usecase.interface";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { UnauthorizedError } from "../errors/unautherized-error";
import { NotFoundError } from "../errors/not-found-error";
import { BadRequestError } from "../errors/bad-request-error";
import { InternalServerError } from "../errors/internal-server-error";
import { BaseController } from "./base.controller";
import { GetInstructorDetailsUseCase } from "../../../app/usecases/instructor/interfaces/get-instructor-details.usecase.interface";
import { getSocketIOInstance } from "../../socketio";

export class InstructorController extends BaseController {
  constructor(
    private _createInstructorUseCase: ICreateInstructorUseCase,
    private _updateInstructorUseCase: IUpdateInstructorUseCase,
    private _approveInstructorUseCase: IApproveInstructorUseCase,
    private _declineInstructorUseCase: IDeclineInstructorUseCase,
    private _getInstructorByUserIdUseCase: IGetInstructorByUserIdUseCase,
    private _getAllInstructorsUseCase: IGetAllInstructorsUseCase,
    private _userRepository: IUserRepository,
    private _getInstructorDetailsUseCase: GetInstructorDetailsUseCase,
    httpErrors: IHttpErrors,
    httpSuccess: IHttpSuccess
  ) {
    super(httpErrors, httpSuccess);
  }

  async createInstructor(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }
      const validated = validateCreateInstructor(request.body);
      const instructor = await this._createInstructorUseCase.execute(
        { ...validated, userId: request.user.id },
        request.user
      );

      // Fetch user data for response
      const user = await this._userRepository.findById(request.user.id);
      if (!user) {
        throw new InternalServerError(
          "User data not found after instructor creation"
        );
      }

      return this.success_201(
        {
          id: instructor.id,
          userId: instructor.userId,
          areaOfExpertise: instructor.areaOfExpertise,
          professionalExperience: instructor.professionalExperience,
          about: instructor.about,
          website: instructor.website,
          education: instructor.education,
          certifications: instructor.certifications,
          cv: instructor.cv,
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
        "Instructor application submitted successfully"
      );
    });
  }

  async updateInstructor(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }
      const validated = validateUpdateInstructor(request.body);
      const instructor = await this._updateInstructorUseCase.execute(
        validated,
        request.user
      );
      const user = await this._userRepository.findById(request.user.id);
      if (!user) {
        throw new NotFoundError("User not found");
      }
      return this.success_200(
        {
          id: instructor.id,
          userId: instructor.userId,
          areaOfExpertise: instructor.areaOfExpertise,
          professionalExperience: instructor.professionalExperience,
          about: instructor.about,
          website: instructor.website,
          education: instructor.education,
          certifications: instructor.certifications,
          cv: instructor.cv,
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
        "Instructor updated successfully"
      );
    });
  }

  async approveInstructor(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }
      const validated = validateApproveInstructor(request.body);
      const instructor = await this._approveInstructorUseCase.execute(
        validated,
        request.user
      );

      // Get user details for Socket.IO notification
      const user = await this._userRepository.findById(instructor.userId);

      // Emit real-time notification to the instructor
      const io = getSocketIOInstance();
      if (io && user) {
        io.to(instructor.userId).emit("newNotification", {
          message: `Congratulations! Your instructor application has been approved. You can now create and publish courses.`,
          type: "INSTRUCTOR_APPROVED",
          instructorId: instructor.id,
          instructorName: user.name || user.email,
          timestamp: new Date().toISOString(),
        });
      }

      return this.success_200(
        {
          id: instructor.id,
          status: instructor.status,
        },
        "Instructor approved successfully"
      );
    });
  }

  async declineInstructor(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }
      const validated = validateDeclineInstructor(request.body);
      const instructor = await this._declineInstructorUseCase.execute(
        validated,
        request.user
      );

      // Get user details for Socket.IO notification
      const user = await this._userRepository.findById(instructor.userId);

      // Emit real-time notification to the instructor
      const io = getSocketIOInstance();
      if (io && user) {
        io.to(instructor.userId).emit("newNotification", {
          message: `Your instructor application has been declined. You can reapply after 24 hours with updated information.`,
          type: "INSTRUCTOR_DECLINED",
          instructorId: instructor.id,
          instructorName: user.name || user.email,
          timestamp: new Date().toISOString(),
        });
      }

      return this.success_200(
        {
          id: instructor.id,
          status: instructor.status,
        },
        "Instructor declined successfully"
      );
    });
  }

  async getInstructorByUserId(
    httpRequest: IHttpRequest
  ): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }
      const validated = validateGetInstructorByUserId({
        userId: request.user.id,
      });
      const instructor = await this._getInstructorByUserIdUseCase.execute(
        validated
      );
      const user = await this._userRepository.findById(request.user.id);
      if (!user) {
        throw new NotFoundError("User not found");
      }
      return this.success_200(
        instructor
          ? {
              id: instructor.id,
              userId: instructor.userId,
              areaOfExpertise: instructor.areaOfExpertise,
              professionalExperience: instructor.professionalExperience,
              about: instructor.about,
              website: instructor.website,
              education: instructor.education,
              certifications: instructor.certifications,
              cv: instructor.cv,
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
        "Instructor retrieved successfully"
      );
    });
  }

  async getAllInstructors(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateGetAllInstructors(request.query);
      const result = await this._getAllInstructorsUseCase.execute(validated);
      return this.success_200(result, "Instructors retrieved successfully");
    });
  }

  async getInstructorDetails(
    httpRequest: IHttpRequest
  ): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const { userId } = request.params || {};
      if (!userId) {
        throw new BadRequestError("User ID is required");
      }
      const result = await this._getInstructorDetailsUseCase.execute(userId);
      return this.success_200(
        result,
        "Instructor details retrieved successfully"
      );
    });
  }
}
