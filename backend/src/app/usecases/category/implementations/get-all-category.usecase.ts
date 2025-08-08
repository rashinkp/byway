import { ICategoryRepository } from "../../../repositories/category.repository";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { IGetAllCategoriesUseCase } from "../interfaces/get-all-categories.usecases.interface";
import {
  ICategoryListOutputDTO,
  IGetAllCategoriesInputDTO,
} from "../../../dtos/category.dto";

export class GetAllCategoriesUseCase implements IGetAllCategoriesUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(
    input: IGetAllCategoriesInputDTO
  ): Promise<ICategoryListOutputDTO> {
    try {
      const { categories, total } = await this.categoryRepository.findAll(
        input
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
