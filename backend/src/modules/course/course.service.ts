import { StatusCodes } from "http-status-codes";
import { AppError } from "../../utils/appError";
import { logger } from "../../utils/logger";
import { CourseRepository } from "./course.repository";
import { CategoryService } from "../category/category.service";
import { UserService } from "../user/user.service";
import {
  ICourse,
  ICreateCourseInput,
  IUpdateCourseInput,
  IGetAllCoursesInput,
  ICreateEnrollmentInput,
  IEnrollment,
  ICourseDetails,
  IGetEnrolledCoursesInput,
} from "./course.types";
import {
  createCourseSchema,
  updateCourseSchema,
  getAllCoursesSchema,
  createEnrollmentSchema,
  courseIdSchema,
  getEnrolledCoursesSchema,
} from "./course.validator";
import { Role } from "@prisma/client";
import { ICourseRepository } from "./course.repository.interface";

export class CourseService {
  constructor(
    private courseRepository: ICourseRepository,
    private categoryService: CategoryService,
    private userService: UserService
  ) {}

  async createCourse(input: ICreateCourseInput): Promise<ICourse> {
    const parsedInput = createCourseSchema.safeParse(input);
    if (!parsedInput.success) {
      logger.warn("Validation failed for createCourse", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    const { categoryId, title, createdBy } = parsedInput.data;

    // Validate createdBy is an instructor
    const user = await this.userService.findUserById(createdBy);
    if (!user) {
      logger.warn("User not found for course creation", { createdBy });
      throw new AppError("User not found", StatusCodes.NOT_FOUND, "NOT_FOUND");
    }
    if (user.role !== Role.INSTRUCTOR) {
      logger.warn("User is not an instructor for course creation", {
        createdBy,
      });
      throw new AppError(
        "Only instructors can create courses",
        StatusCodes.FORBIDDEN,
        "FORBIDDEN"
      );
    }

    // Validate category
    const category = await this.categoryService.getCategoryById(categoryId);
    if (!category || category.deletedAt) {
      logger.warn("Category not found or deleted", { categoryId });
      throw new AppError(
        "Category not found or deleted",
        StatusCodes.NOT_FOUND,
        "NOT_FOUND"
      );
    }

    // Check for existing course
    const existingCourse = await this.courseRepository.getCourseByName(title);
    if (existingCourse && !existingCourse.deletedAt) {
      logger.warn("Course already exists", { title });
      throw new AppError(
        "A course with this title already exists",
        StatusCodes.BAD_REQUEST,
        "ALREADY_EXISTS"
      );
    }

    try {
      return await this.courseRepository.createCourse(parsedInput.data);
    } catch (error) {
      logger.error("Error creating course", { error, input });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to create course",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async getAllCourses(
    input: IGetAllCoursesInput
  ): Promise<{ courses: ICourse[]; total: number; totalPage: number }> {
    const parsedInput = getAllCoursesSchema.safeParse(input);
    if (!parsedInput.success) {
      logger.warn("Validation failed for getAllCourses", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    try {
      return await this.courseRepository.getAllCourses(parsedInput.data);
    } catch (error) {
      logger.error("Error retrieving courses", { error, input });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to retrieve courses",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async getCourseById(courseId: string): Promise<ICourse | null> {
    const parsedInput = courseIdSchema.safeParse({ courseId });
    if (!parsedInput.success) {
      logger.warn("Validation failed for getCourseById", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    try {
      const course = await this.courseRepository.getCourseById(
        parsedInput.data.courseId
      );
      if (!course) {
        logger.warn("Course not found", { courseId });
        throw new AppError(
          "Course not found",
          StatusCodes.NOT_FOUND,
          "NOT_FOUND"
        );
      }
      return course;
    } catch (error) {
      logger.error("Error retrieving course by ID", { error, courseId });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to retrieve course",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async getCourseDetails(courseId: string): Promise<ICourseDetails | null> {
    const parsedInput = courseIdSchema.safeParse({ courseId });
    if (!parsedInput.success) {
      logger.warn("Validation failed for getCourseById", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    try {
      const courseDetails = await this.courseRepository.getCourseById(
        parsedInput.data.courseId
      );
      if (!courseDetails) {
        logger.warn("Course not found", { courseId });
        throw new AppError(
          "Course not found",
          StatusCodes.NOT_FOUND,
          "NOT_FOUND"
        );
      }
      return { ...courseDetails, courseId };
    } catch (error) {
      logger.error("Error retrieving course by ID", { error, courseId });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to retrieve course",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async updateCourse(input: IUpdateCourseInput): Promise<ICourse> {
    const parsedInput = updateCourseSchema.safeParse(input);
    if (!parsedInput.success) {
      logger.warn("Validation failed for updateCourse", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    const { id: courseId, categoryId, title, createdBy } = parsedInput.data;

    // Validate course
    const course = await this.courseRepository.getCourseById(courseId);
    if (!course || course.deletedAt) {
      logger.warn("Course not found or deleted", { courseId });
      throw new AppError(
        "Course not found or deleted",
        StatusCodes.NOT_FOUND,
        "NOT_FOUND"
      );
    }

    // Validate ownership
    if (course.createdBy !== createdBy) {
      logger.warn("Unauthorized course update attempt", {
        courseId,
        createdBy,
      });
      throw new AppError(
        "Unauthorized: You can only update your own courses",
        StatusCodes.FORBIDDEN,
        "FORBIDDEN"
      );
    }

    // Validate category
    if (categoryId && categoryId !== course.categoryId) {
      const category = await this.categoryService.getCategoryById(categoryId);
      if (!category || category.deletedAt) {
        logger.warn("Category not found or deleted", { categoryId });
        throw new AppError(
          "Category not found or deleted",
          StatusCodes.NOT_FOUND,
          "NOT_FOUND"
        );
      }
    }

    // Check for title uniqueness
    if (title && title !== course.title) {
      const existingCourse = await this.courseRepository.getCourseByName(title);
      if (existingCourse && !existingCourse.deletedAt) {
        logger.warn("Course already exists", { title });
        throw new AppError(
          "A course with this title already exists",
          StatusCodes.BAD_REQUEST,
          "ALREADY_EXISTS"
        );
      }
    }

    try {
      return await this.courseRepository.updateCourse(parsedInput.data);
    } catch (error) {
      logger.error("Error updating course", { error, input });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to update course",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async softDeleteCourse(
    courseId: string,
    userId: string,
    role: "ADMIN" | "INSTRUCTOR" | "USER"
  ): Promise<ICourse> {
    const parsedInput = courseIdSchema.safeParse({ courseId });
    if (!parsedInput.success) {
      logger.warn("Validation failed for softDeleteCourse", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    try {
      const course = await this.courseRepository.getCourseById(courseId);
      if (!course) {
        logger.warn("Course not found or already deleted", { courseId });
        throw new AppError(
          "Course not found or already deleted",
          StatusCodes.NOT_FOUND,
          "NOT_FOUND"
        );
      }
      if (course.createdBy !== userId && role !== "ADMIN") {
        logger.warn("Unauthorized course delete attempt", { courseId, userId });
        throw new AppError(
          "Unauthorized: You can only delete your own courses",
          StatusCodes.FORBIDDEN,
          "FORBIDDEN"
        );
      }

      const deletedAt = course.deletedAt ? null : new Date();
      return await this.courseRepository.softDeleteCourse(courseId, deletedAt);
    } catch (error) {
      logger.error("Error soft deleting course", { error, courseId, userId });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to soft delete course",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async enrollCourse(input: ICreateEnrollmentInput): Promise<IEnrollment[]> {
    const parsedInput = createEnrollmentSchema.safeParse(input);
    if (!parsedInput.success) {
      logger.warn("Validation failed for enrollCourse", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    const { userId, courseIds } = parsedInput.data;

    // Validate user
    const user = await this.userService.findUserById(userId);
    if (!user) {
      logger.warn("User not found for enrollment", { userId });
      throw new AppError("User not found", StatusCodes.NOT_FOUND, "NOT_FOUND");
    }

    // Validate courses and check for existing enrollments
    const enrollments: IEnrollment[] = [];
    for (const courseId of courseIds) {
      // Validate course
      const course = await this.courseRepository.getCourseById(courseId);
      if (!course || course.deletedAt || course.status !== "PUBLISHED") {
        logger.warn("Course not found, deleted, or not published", {
          courseId,
        });
        throw new AppError(
          `Course not found, deleted, or not published: ${courseId}`,
          StatusCodes.NOT_FOUND,
          "NOT_FOUND"
        );
      }

      // Check for existing enrollment
      const existingEnrollment = await this.courseRepository.getEnrollment(
        userId,
        courseId
      );
      if (existingEnrollment) {
        logger.warn("User already enrolled in course", { userId, courseId });
        continue; // Skip duplicate enrollment
      }

      // Create enrollment
      const enrollment = await this.courseRepository.createEnrollment({
        userId,
        courseIds,
      });
      enrollments.push(enrollment);
    }

    if (enrollments.length === 0) {
      logger.warn("No new enrollments created", { userId, courseIds });
      throw new AppError(
        "No new enrollments created (all courses already enrolled)",
        StatusCodes.CONFLICT,
        "ALREADY_ENROLLED"
      );
    }

    try {
      return enrollments;
    } catch (error) {
      logger.error("Error enrolling courses", { error, input });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to enroll courses",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async getEnrolledCourses(
    input: IGetEnrolledCoursesInput
  ): Promise<{ courses: ICourse[]; total: number; totalPage: number }> {
    const parsedInput = getEnrolledCoursesSchema.safeParse(input);
    if (!parsedInput.success) {
      logger.warn("Validation failed for getEnrolledCourses", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }
    logger.info("Parsed input for getEnrolledCourses", {
      input: parsedInput.data,
    }); // Add this

    const user = await this.userService.findUserById(parsedInput.data.userId);
    if (!user) {
      logger.warn("User not found for enrolled courses", {
        userId: parsedInput.data.userId,
      });
      throw new AppError("User not found", StatusCodes.NOT_FOUND, "NOT_FOUND");
    }

    try {
      const result = await this.courseRepository.getEnrolledCourses(
        parsedInput.data
      );
      logger.info("Retrieved enrolled courses", { result }); // Add this
      return result;
    } catch (error) {
      logger.error("Error retrieving enrolled courses", { error, input });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to retrieve enrolled courses",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }
}
