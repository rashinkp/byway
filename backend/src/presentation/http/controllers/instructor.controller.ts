import { Request, Response, NextFunction } from "express";
import { ICreateInstructorUseCase, IUpdateInstructorUseCase, IApproveInstructorUseCase, IDeclineInstructorUseCase, IGetInstructorByUserIdUseCase, IGetAllInstructorsUseCase } from "../../../app/usecases/instructor/instructor.usecase.interface";
import { IUserRepository } from "../../../app/repositories/user.repository";
import { validateApproveInstructor, validateCreateInstructor, validateDeclineInstructor, validateGetAllInstructors, validateGetInstructorByUserId, validateUpdateInstructor } from "../../validators/instructor.validators";
import { JwtPayload } from "../../express/middlewares/auth.middleware";
import { ApiResponse } from "../interfaces/ApiResponse";
import { InstructorResponseDTO } from "../../../domain/dtos/instructor/instructor.dto";
import { APPROVALSTATUS } from "../../../domain/enum/approval-status.enum";

export class InstructorController {
  constructor(
    private createInstructorUseCase: ICreateInstructorUseCase,
    private updateInstructorUseCase: IUpdateInstructorUseCase,
    private approveInstructorUseCase: IApproveInstructorUseCase,
    private declineInstructorUseCase: IDeclineInstructorUseCase,
    private getInstructorByUserIdUseCase: IGetInstructorByUserIdUseCase,
    private getAllInstructorsUseCase: IGetAllInstructorsUseCase,
    private userRepository: IUserRepository
  ) {}

  async createInstructor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = validateCreateInstructor(req.body);
      const userId = (req.user as JwtPayload).id;
      const instructor = await this.createInstructorUseCase.execute({ ...validated, userId }, req.user as JwtPayload);
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      const response: ApiResponse<InstructorResponseDTO> = {
        statusCode: 201,
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
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateInstructor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = validateUpdateInstructor(req.body);
      const instructor = await this.updateInstructorUseCase.execute(validated, req.user as JwtPayload);
      const user = await this.userRepository.findById((req.user as JwtPayload).id);
      if (!user) {
        throw new Error("User not found");
      }
      const response: ApiResponse<InstructorResponseDTO> = {
        statusCode: 200,
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
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async approveInstructor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = validateApproveInstructor(req.body);
      const instructor = await this.approveInstructorUseCase.execute(validated, req.user as JwtPayload);
      const response: ApiResponse<{ id: string; status: string }> = {
        statusCode: 200,
        success: true,
        message: "Instructor approved successfully",
        data: {
          id: instructor.id,
          status: instructor.status,
        },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async declineInstructor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = validateDeclineInstructor(req.body);
      const instructor = await this.declineInstructorUseCase.execute(validated, req.user as JwtPayload);
      const response: ApiResponse<{ id: string; status: string }> = {
        statusCode: 200,
        success: true,
        message: "Instructor declined successfully",
        data: {
          id: instructor.id,
          status: instructor.status,
        },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getInstructorByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = validateGetInstructorByUserId({ userId: (req.user as JwtPayload).id });
      const instructor = await this.getInstructorByUserIdUseCase.execute(validated);
      const user = await this.userRepository.findById((req.user as JwtPayload).id);
      if (!user) {
        throw new Error("User not found");
      }
      const response: ApiResponse<InstructorResponseDTO | null> = {
        statusCode: 200,
        success: true,
        message: instructor ? "Instructor retrieved successfully" : "Instructor not found",
        data: instructor ? {
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
        } : null,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getAllInstructors(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = validateGetAllInstructors(req.query);
      const result = await this.getAllInstructorsUseCase.execute(validated);
      const response: ApiResponse<{ items: InstructorResponseDTO[]; total: number; totalPages: number }> = {
        statusCode: 200,
        success: true,
        message: "Instructors retrieved successfully",
        data: result,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
