import { ICategoryRepository } from "../../../repositories/category.repository";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { IGetAllCategoriesUseCase } from "../interfaces/get-all-categories.usecases.interface";
import {
  ICategoryListOutputDTO,
  IGetAllCategoriesInputDTO,
} from "../../../dtos/category.dto";
import { PaginationFilter } from "../../../../domain/types/pagination-filter.interface";

export class GetAllCategoriesUseCase implements IGetAllCategoriesUseCase {
  constructor(private _categoryRepository: ICategoryRepository) {}

  async execute(
    dto: IGetAllCategoriesInputDTO
  ): Promise<ICategoryListOutputDTO> {
    try {
      const {
        page,
        limit,
        sortBy,
        sortOrder,
        includeDeleted,
        search,
        filterBy,
      } = dto;

      const paginationFilter: PaginationFilter = {
        page,
        limit,
        sortBy,
        sortOrder,
        includeDeleted,
        search,
        filterBy,
      };

      const { categories, total } = await this._categoryRepository.findAll(
        paginationFilter
      );
      return {
        categories: categories.map((category) => ({
          id: category.id,
          name: category.name,
          description: category.description,
          createdBy: category.createdBy,
          createdAt: category.createdAt.toISOString(),
          updatedAt: category.updatedAt.toISOString(),
          deletedAt: category.deletedAt?.toISOString(),
        })),
        total,
      };
    } catch (error) {
      throw error instanceof HttpError
        ? error
        : new HttpError("Failed to retrieve categories", 500);
    }
  }
}
