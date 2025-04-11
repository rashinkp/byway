import { StatusCodes } from "http-status-codes";
import { CategoryService } from "./category.service";
import { ApiResponse } from "../../types/response";
import { ICreateCategoryInput, IGetAllCategoriesInput, IUpdateCategoryInput } from "./types";


export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  async createCategory(
    input: ICreateCategoryInput
  ): Promise<ApiResponse> {
    try {
      const category = await this.categoryService.createCategory(input);
      return {
        status: "success",
        data: category,
        message: "Category created successfully",
        statusCode: StatusCodes.CREATED,
      };
    } catch (error) {
      return {
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to create category",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
  }

  async getAllCategories(
    input: IGetAllCategoriesInput
  ): Promise<ApiResponse> {
    try {
      const result = await this.categoryService.getAllCategories(input);
      return {
        status: "success",
        data: result,
        message: "Categories retrieved successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      return {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve categories",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
  }

  async getCategoryById(id: string): Promise<ApiResponse> {
    try {
      const category = await this.categoryService.getCategoryById(id);
      if (!category) {
        return {
          status: "error",
          message: "Category not found",
          statusCode: StatusCodes.NOT_FOUND,
          data: null,
        };
      }
      return {
        status: "success",
        data: category,
        message: "Category retrieved successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      return {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve category",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
  }

  async updateCategory(
    input: IUpdateCategoryInput
  ): Promise<ApiResponse> {
    try {
      const category = await this.categoryService.updateCategory(input);
      return {
        status: "success",
        data: category,
        message: "Category updated successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      return {
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to update category",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
  }

  async deleteCategory(id: string): Promise<ApiResponse> {
    try {
      await this.categoryService.deleteCategory(id);
      return {
        status: "success",
        data: null,
        message: "Category deleted successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      return {
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to delete category",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
  }
}