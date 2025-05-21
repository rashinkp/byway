import { ICreateCategoryUseCase } from "../../../app/usecases/category/interfaces/create-category.usecase.interface";
import { IGetAllCategoriesUseCase } from "../../../app/usecases/category/interfaces/get-all-categories.usecases.interface";
import { IGetCategoryByIdUseCase } from "../../../app/usecases/category/interfaces/get-cateogry-by-Id.usecase.interface";
import { IUpdateCategoryUseCase } from "../../../app/usecases/category/interfaces/update-category.usecase.interface";
import { IDeleteCategoryUseCase } from "../../../app/usecases/category/interfaces/delete-category.usecase.interface";
import { IRecoverCategoryUseCase } from "../../../app/usecases/category/interfaces/recover-category.usecase.interface";
import { ApiResponse } from "../interfaces/ApiResponse";
import {
  validateCategoryId,
  validateCreateCategory,
  validateGetAllCategories,
  validateUpdateCategory,
} from "../../validators/category.validators";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { UnauthorizedError } from "../errors/unautherized-error";
import { BadRequestError } from "../errors/bad-request-error";

export class CategoryController {
  constructor(
    private createCategoryUseCase: ICreateCategoryUseCase,
    private getAllCategoriesUseCase: IGetAllCategoriesUseCase,
    private getCategoryByIdUseCase: IGetCategoryByIdUseCase,
    private updateCategoryUseCase: IUpdateCategoryUseCase,
    private deleteCategoryUseCase: IDeleteCategoryUseCase,
    private recoverCategoryUseCase: IRecoverCategoryUseCase,
    private httpErrors: IHttpErrors,
    private httpSuccess: IHttpSuccess
  ) {}

  async createCategory(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const createdBy = httpRequest.user?.id;
      if (!createdBy) {
        throw new UnauthorizedError("User not authenticated");
      }
      const validated = validateCreateCategory({
        ...httpRequest.body,
        createdBy,
      });
      const category = await this.createCategoryUseCase.execute(validated);
      const response: ApiResponse = {
        statusCode: 201,
        success: true,
        message: "Category created successfully",
        data: category,
      };
      return this.httpSuccess.success_201(response);
    } catch (error) {
      if (
        error instanceof BadRequestError ||
        error instanceof UnauthorizedError
      ) {
        return this.httpErrors.error_400();
      }
      return this.httpErrors.error_500();
    }
  }

  async getAllCategories(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validated = validateGetAllCategories(httpRequest.query);
      const result = await this.getAllCategoriesUseCase.execute(validated);
      const response: ApiResponse = {
        statusCode: 200,
        success: true,
        message: "Categories retrieved successfully",
        data: result,
      };
      return this.httpSuccess.success_200(response);
    } catch (error) {
      if (error instanceof BadRequestError) {
        return this.httpErrors.error_400();
      }
      return this.httpErrors.error_500();
    }
  }

  async getCategoryById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validated = validateCategoryId({ id: httpRequest.params.id });
      const category = await this.getCategoryByIdUseCase.execute(validated);
      const response: ApiResponse = {
        statusCode: 200,
        success: true,
        message: "Category retrieved successfully",
        data: category,
      };
      return this.httpSuccess.success_200(response);
    } catch (error) {
      if (error instanceof BadRequestError) {
        return this.httpErrors.error_400();
      }
      return this.httpErrors.error_500();
    }
  }

  async updateCategory(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validated = validateUpdateCategory({
        ...httpRequest.body,
        id: httpRequest.params.id,
      });
      const category = await this.updateCategoryUseCase.execute(validated);
      const response: ApiResponse = {
        statusCode: 200,
        success: true,
        message: "Category updated successfully",
        data: category,
      };
      return this.httpSuccess.success_200(response);
    } catch (error) {
      if (error instanceof BadRequestError) {
        return this.httpErrors.error_400();
      }
      return this.httpErrors.error_500();
    }
  }

  async deleteCategory(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validated = validateCategoryId({ id: httpRequest.params.id });
      const category = await this.deleteCategoryUseCase.execute(validated);
      const response: ApiResponse = {
        statusCode: 200,
        success: true,
        message: "Category deleted successfully",
        data: category,
      };
      return this.httpSuccess.success_200(response);
    } catch (error) {
      if (error instanceof BadRequestError) {
        return this.httpErrors.error_400();
      }
      return this.httpErrors.error_500();
    }
  }

  async recoverCategory(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validated = validateCategoryId({ id: httpRequest.params.id });
      const category = await this.recoverCategoryUseCase.execute(validated);
      const response: ApiResponse = {
        statusCode: 200,
        success: true,
        message: "Category recovered successfully",
        data: category,
      };
      return this.httpSuccess.success_200(response);
    } catch (error) {
      if (error instanceof BadRequestError) {
        return this.httpErrors.error_400();
      }
      return this.httpErrors.error_500();
    }
  }
}
