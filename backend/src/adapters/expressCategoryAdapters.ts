import { Request, Response, NextFunction } from "express";
import { CategoryController } from "../modules/category/category.controller";
import {
  ICreateCategoryInput,
  IGetAllCategoriesInput,
  IUpdateCategoryInput,
} from "../modules/category/category.types";

interface AuthenticatedRequest extends Request {
  user: { id: string; email: string; role: string };
}

const asyncHandler = (
  fn: (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req as AuthenticatedRequest, res, next)).catch(next);
};

export const adaptCategoryController = (controller: CategoryController) => ({
  createCategory: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const input: ICreateCategoryInput = {
        ...req.body,
        createdBy: req.user.id,
      };
      const result = await controller.createCategory(input);
      res.status(result.statusCode).json(result);
    }
  ),

  getAllCategories: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const {
        page,
        limit,
        sortBy,
        sortOrder,
        includeDeleted,
        search,
        filterBy,
      } = req.query;
       const allowedFilters = ["All", "Active", "Inactive"] as const;
       type FilterByType = (typeof allowedFilters)[number];

       const filterByValidated: FilterByType = allowedFilters.includes(
         filterBy as FilterByType
       )
         ? (filterBy as FilterByType)
         : "All";

      const input: IGetAllCategoriesInput = {
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        sortBy: sortBy as "name" | "createdAt" | "updatedAt" | undefined,
        sortOrder: sortOrder as "asc" | "desc" | undefined,
        includeDeleted: includeDeleted === "true" ? true : undefined,
        search: search ? (search as string) : "",
        filterBy: filterByValidated,
      };
      const result = await controller.getAllCategories(input);
      res.status(result.statusCode).json(result);
    }
  ),

  getCategoryById: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const result = await controller.getCategoryById(req.params.id);
      res.status(result.statusCode).json(result);
    }
  ),

  updateCategory: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const input: IUpdateCategoryInput = { id: req.params.id, ...req.body };
      const result = await controller.updateCategory(input);
      res.status(result.statusCode).json(result);
    }
  ),

  deleteCategory: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const id = req.params.id;
      const result = await controller.deleteCategory(id);

      res.status(result.statusCode as number).json({
        status: result.status,
        data: result.data,
        message: result.message,
      });
    }
  ),

  recoverCategory: asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const input = { id: req.params.id };
      const result = await controller.recoverCategory(input);

      res.status(result.statusCode as number).json({
        status: result.status,
        data: result.data,
        message: result.message,
      });
    }
  ),
});
