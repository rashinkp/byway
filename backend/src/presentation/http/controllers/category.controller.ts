import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { BadRequestError } from "../errors/bad-request-error";
import { ICreateCategoryUseCase } from "../../../app/usecases/category/interfaces/create-category.usecase.interface";
import { IUpdateCategoryUseCase } from "../../../app/usecases/category/interfaces/update-category.usecase.interface";
import { IGetCategoryByIdUseCase } from "../../../app/usecases/category/interfaces/get-cateogry-by-Id.usecase.interface";
import { IGetAllCategoriesUseCase } from "../../../app/usecases/category/interfaces/get-all-categories.usecases.interface";
import { IDeleteCategoryUseCase } from "../../../app/usecases/category/interfaces/delete-category.usecase.interface";
import { IRecoverCategoryUseCase } from "../../../app/usecases/category/interfaces/recover-category.usecase.interface";
import { validateCreateCategory, validateCategoryId, validateGetAllCategories, validateUpdateCategory } from "../../validators/category.validators";
import { BaseController } from "./base.controller";

export class CategoryController extends BaseController {
  constructor(
    private createCategoryUseCase: ICreateCategoryUseCase,
    private updateCategoryUseCase: IUpdateCategoryUseCase,
    private getCategoryByIdUseCase: IGetCategoryByIdUseCase,
    private getAllCategoriesUseCase: IGetAllCategoriesUseCase,
    private deleteCategoryUseCase: IDeleteCategoryUseCase,
    private recoverCategoryUseCase: IRecoverCategoryUseCase,
    httpErrors: IHttpErrors,
    httpSuccess: IHttpSuccess
  ) {
    super(httpErrors, httpSuccess);
  }

  async createCategory(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateCreateCategory({
        ...request.body,
        createdBy: request.user?.id
      });
      const category = await this.createCategoryUseCase.execute(validated);
      return this.success_201(category, "Category created successfully");
    });
  }

  async updateCategory(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateUpdateCategory({
        ...request.body,
        id: request.params.categoryId,
      });
      const category = await this.updateCategoryUseCase.execute(validated);
      return this.success_200(category, "Category updated successfully");
    });
  }

  async getCategoryById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateCategoryId({ id: request.params.categoryId });
      const category = await this.getCategoryByIdUseCase.execute(validated);
      if (!category) {
        throw new BadRequestError("Category not found");
      }
      return this.success_200(category, "Category retrieved successfully");
    });
  }

  async getAllCategories(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateGetAllCategories(request.query);
      const result = await this.getAllCategoriesUseCase.execute(validated);
      return this.success_200(result, "Categories retrieved successfully");
    });
  }

  async deleteCategory(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateCategoryId({ id: request.params.categoryId });
      await this.deleteCategoryUseCase.execute(validated);
      return this.success_200(null, "Category deleted successfully");
    });
  }

  async recoverCategory(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateCategoryId({ id: request.params.categoryId });
      const category = await this.recoverCategoryUseCase.execute(validated);
      return this.success_200(category, "Category recovered successfully");
    });
  }
}
