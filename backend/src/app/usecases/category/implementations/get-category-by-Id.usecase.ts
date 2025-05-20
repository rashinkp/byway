import { ICategoryRepository } from "../../../../infra/repositories/interfaces/category.repository";
import { HttpError } from "../../../../presentation/http/utils/HttpErrors";
import { IGetCategoryByIdUseCase } from "../interfaces/get-cateogry-by-Id.usecase.interface";
import {
  ICategoryIdInputDTO,
  ICategoryOutputDTO,
} from "../../../../domain/dtos/category/category.dto";

export class GetCategoryByIdUseCase implements IGetCategoryByIdUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(input: ICategoryIdInputDTO): Promise<ICategoryOutputDTO> {
    const category = await this.categoryRepository.findById(input.id);
    if (!category) {
      throw new HttpError("Category not found", 404);
    }

    return {
      id: category.id,
      name: category.name,
      description: category.description,
      createdBy: category.createdBy,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
      deletedAt: category.deletedAt?.toISOString(),
    };
  }
}
