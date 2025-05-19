import { Request, Response, NextFunction } from "express";
import { ICreateCategoryUseCase } from "../../../app/usecases/category/interfaces/create-category.usecase.interface";
import { IGetAllCategoriesUseCase } from "../../../app/usecases/category/interfaces/get-all-categories.usecases.interface";
import { IGetCategoryByIdUseCase } from "../../../app/usecases/category/interfaces/get-cateogry-by-Id.usecase.interface";
import { IUpdateCategoryUseCase } from "../../../app/usecases/category/interfaces/update-category.usecase.interface";
import { IDeleteCategoryUseCase } from "../../../app/usecases/category/interfaces/delete-category.usecase.interface";
import { IRecoverCategoryUseCase } from "../../../app/usecases/category/interfaces/recover-category.usecase.interface";
import { ApiResponse } from "../interfaces/ApiResponse";
import { validateCategoryId, validateCreateCategory, validateGetAllCategories, validateUpdateCategory } from "../../validators/category.validators";

export class CategoryController {
  constructor(
    private createCategoryUseCase: ICreateCategoryUseCase,
    private getAllCategoriesUseCase: IGetAllCategoriesUseCase,
    private getCategoryByIdUseCase: IGetCategoryByIdUseCase,
    private updateCategoryUseCase: IUpdateCategoryUseCase,
    private deleteCategoryUseCase: IDeleteCategoryUseCase,
    private recoverCategoryUseCase: IRecoverCategoryUseCase
  ) {}

  async createCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validated = validateCreateCategory(req.body);
      const category = await this.createCategoryUseCase.execute(validated);
      const response: ApiResponse = {
        statusCode: 201,
        success: true,
        message: "Category created successfully",
        data: category,
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getAllCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validated = validateGetAllCategories(req.query);
      const result = await this.getAllCategoriesUseCase.execute(validated);
      const response: ApiResponse = {
        statusCode: 200,
        success: true,
        message: "Categories retrieved successfully",
        data: result,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getCategoryById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validated = validateCategoryId({ id: req.params.id });
      const category = await this.getCategoryByIdUseCase.execute(validated);
      const response: ApiResponse = {
        statusCode: 200,
        success: true,
        message: "Category retrieved successfully",
        data: category,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validated = validateUpdateCategory({
        ...req.body,
        id: req.params.id,
      });
      const category = await this.updateCategoryUseCase.execute(validated);
      const response: ApiResponse = {
        statusCode: 200,
        success: true,
        message: "Category updated successfully",
        data: category,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validated = validateCategoryId({ id: req.params.id });
      const category = await this.deleteCategoryUseCase.execute(validated);
      const response: ApiResponse = {
        statusCode: 200,
        success: true,
        message: "Category deleted successfully",
        data: category,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async recoverCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validated = validateCategoryId({ id: req.params.id });
      const category = await this.recoverCategoryUseCase.execute(validated);
      const response: ApiResponse = {
        statusCode: 200,
        success: true,
        message: "Category recovered successfully",
        data: category,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
