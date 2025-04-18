import { StatusCodes } from "http-status-codes";
import { AppError } from "../../utils/appError";
import { logger } from "../../utils/logger";
import { CategoryService } from "./category.service";
import { ApiResponse } from "../../types/response";
import {
  ICreateCategoryInput,
  IGetAllCategoriesInput,
  IUpdateCategoryInput,
  IRecoverCategoryInput,
} from "./category.types";

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  async createCategory(input: ICreateCategoryInput): Promise<ApiResponse> {
    try {
      const category = await this.categoryService.createCategory(input);
      return {
        status: "success",
        data: category,
        message: "Category created successfully",
        statusCode: StatusCodes.CREATED,
      };
    } catch (error) {
      logger.error("Error creating category", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            error instanceof Error
              ? error.message
              : "Failed to create category",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async getAllCategories(input: IGetAllCategoriesInput): Promise<ApiResponse> {
    try {
      const result = await this.categoryService.getAllCategories(input);
      return {
        status: "success",
        data: result,
        message: "Categories retrieved successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      logger.error("Error retrieving categories", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            error instanceof Error
              ? error.message
              : "Failed to retrieve categories",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async getCategoryById(id: string): Promise<ApiResponse> {
    try {
      const category = await this.categoryService.getCategoryById(id);
      return {
        status: "success",
        data: category,
        message: "Category retrieved successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      logger.error("Error retrieving category by ID", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            error instanceof Error
              ? error.message
              : "Failed to retrieve category",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async updateCategory(input: IUpdateCategoryInput): Promise<ApiResponse> {
    try {
      const category = await this.categoryService.updateCategory(input);
      return {
        status: "success",
        data: category,
        message: "Category updated successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      logger.error("Error updating category", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            error instanceof Error
              ? error.message
              : "Failed to update category",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async deleteCategory(id: string): Promise<ApiResponse> {
    try {
      const category = await this.categoryService.deleteCategory(id);
      return {
        status: "success",
        data: category,
        message: "Category deleted successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      logger.error("Error deleting category", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            error instanceof Error
              ? error.message
              : "Failed to delete category",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async recoverCategory(input: IRecoverCategoryInput): Promise<ApiResponse> {
    try {
      const category = await this.categoryService.recoverCategory(input);
      return {
        status: "success",
        data: category,
        message: "Category recovered successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      logger.error("Error recovering category", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            error instanceof Error
              ? error.message
              : "Failed to recover category",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }
}
