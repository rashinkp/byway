import { StatusCodes } from "http-status-codes";
import { AppError } from "../../utils/appError";
import { logger } from "../../utils/logger";
import { CategoryRepository } from "./category.repository";
import {
  ICategory,
  ICreateCategoryInput,
  IGetAllCategoriesInput,
  IUpdateCategoryInput,
  IRecoverCategoryInput,
} from "./category.types";
import {
  createCategorySchema,
  updateCategorySchema,
  getAllCategoriesSchema,
  categoryIdSchema,
} from "./category.validator";
import { UserService } from "../user/user.service";
import { Role } from "@prisma/client";

export class CategoryService {
  constructor(
    private categoryRepository: CategoryRepository,
    private userService: UserService
  ) {}

  async createCategory(input: ICreateCategoryInput): Promise<ICategory> {
    const parsedInput = createCategorySchema.safeParse(input);
    if (!parsedInput.success) {
      logger.warn("Validation failed for createCategory", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    const { name, createdBy } = parsedInput.data;

    // Validate createdBy is an admin
    const user = await this.userService.findUserById(createdBy);
    if (!user) {
      logger.warn("User not found for category creation", { createdBy });
      throw new AppError("User not found", StatusCodes.NOT_FOUND, "NOT_FOUND");
    }
    if (user.role !== Role.ADMIN) {
      logger.warn("User is not an admin for category creation", { createdBy });
      throw new AppError(
        "Only admins can create categories",
        StatusCodes.FORBIDDEN,
        "FORBIDDEN"
      );
    }

    // Check for existing category
    const existingCategory = await this.categoryRepository.getCategoryByName(
      name
    );
    if (existingCategory && !existingCategory.deletedAt) {
      logger.warn("Category already exists", { name });
      throw new AppError(
        "A category with this name already exists",
        StatusCodes.BAD_REQUEST,
        "ALREADY_EXISTS"
      );
    }

    try {
      return await this.categoryRepository.createCategory(parsedInput.data);
    } catch (error) {
      logger.error("Error creating category", { error, input });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to create category",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async getAllCategories(
    input: IGetAllCategoriesInput
  ): Promise<{ categories: ICategory[]; total: number }> {
    const parsedInput = getAllCategoriesSchema.safeParse(input);
    if (!parsedInput.success) {
      logger.warn("Validation failed for getAllCategories", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    try {
      return await this.categoryRepository.getAllCategories(parsedInput.data);
    } catch (error) {
      logger.error("Error retrieving categories", { error, input });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to retrieve categories",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async getCategoryById(id: string): Promise<ICategory | null> {
    const parsedInput = categoryIdSchema.safeParse({ id });
    if (!parsedInput.success) {
      logger.warn("Validation failed for getCategoryById", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    try {
      const category = await this.categoryRepository.getCategoryById(
        parsedInput.data.id
      );
      if (!category) {
        logger.warn("Category not found", { id });
        throw new AppError(
          "Category not found",
          StatusCodes.NOT_FOUND,
          "NOT_FOUND"
        );
      }
      return category;
    } catch (error) {
      logger.error("Error retrieving category by ID", { error, id });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to retrieve category",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async updateCategory(input: IUpdateCategoryInput): Promise<ICategory> {
    const parsedInput = updateCategorySchema.safeParse(input);
    if (!parsedInput.success) {
      logger.warn("Validation failed for updateCategory", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    const { id, name } = parsedInput.data;
    if (name) {
      const existingCategory = await this.categoryRepository.getCategoryByName(
        name
      );
      if (
        existingCategory &&
        existingCategory.id !== id &&
        !existingCategory.deletedAt
      ) {
        logger.warn("Category already exists", { name });
        throw new AppError(
          "A category with this name already exists",
          StatusCodes.BAD_REQUEST,
          "ALREADY_EXISTS"
        );
      }
    }

    try {
      return await this.categoryRepository.updateCategory(parsedInput.data);
    } catch (error) {
      logger.error("Error updating category", { error, input });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to update category",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async deleteCategory(id: string): Promise<ICategory> {
    const parsedInput = categoryIdSchema.safeParse({ id });
    if (!parsedInput.success) {
      logger.warn("Validation failed for deleteCategory", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    try {
      const category = await this.categoryRepository.getCategoryById(id);
      if (!category) {
        logger.warn("Category not found", { id });
        throw new AppError(
          "Category not found",
          StatusCodes.NOT_FOUND,
          "NOT_FOUND"
        );
      }
      if (category.deletedAt) {
        logger.warn("Category is already deleted", { id });
        throw new AppError(
          "Category is already deleted",
          StatusCodes.BAD_REQUEST,
          "ALREADY_DELETED"
        );
      }
      return await this.categoryRepository.deleteCategory(id);
    } catch (error) {
      logger.error("Error deleting category", { error, id });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to delete category",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async recoverCategory(input: IRecoverCategoryInput): Promise<ICategory> {
    const parsedInput = categoryIdSchema.safeParse(input);
    if (!parsedInput.success) {
      logger.warn("Validation failed for recoverCategory", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    try {
      const category = await this.categoryRepository.getCategoryById(input.id);
      if (!category) {
        logger.warn("Category not found", { id: input.id });
        throw new AppError(
          "Category not found",
          StatusCodes.NOT_FOUND,
          "NOT_FOUND"
        );
      }
      if (!category.deletedAt) {
        logger.warn("Category is not deleted", { id: input.id });
        throw new AppError(
          "Category is not deleted",
          StatusCodes.BAD_REQUEST,
          "NOT_DELETED"
        );
      }
      return await this.categoryRepository.recoverCategory(input.id);
    } catch (error) {
      logger.error("Error recovering category", { error, input });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to recover category",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }
}
