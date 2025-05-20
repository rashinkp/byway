import {
  ICategoryIdInputDTO,
  ICategoryOutputDTO,
} from "../../../../domain/dtos/category/category.dto";
import { HttpError } from "../../../../presentation/http/utils/HttpErrors";
import { ICategoryRepository } from "../../../../infra/repositories/interfaces/category.repository";
import { IRecoverCategoryUseCase } from "../interfaces/recover-category.usecase.interface";

export class RecoverCategoryUseCase implements IRecoverCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(input: ICategoryIdInputDTO): Promise<ICategoryOutputDTO> {
    const category = await this.categoryRepository.findById(input.id);
    if (!category) {
      throw new HttpError("Category not found", 404);
    }
    if (category.isActive()) {
      throw new HttpError("Category is not deleted", 400);
    }

    category.recover();
    const savedCategory = await this.categoryRepository.save(category);

    return {
      id: savedCategory.id,
      name: savedCategory.name,
      description: savedCategory.description,
      createdBy: savedCategory.createdBy,
      createdAt: savedCategory.createdAt.toISOString(),
      updatedAt: savedCategory.updatedAt.toISOString(),
      deletedAt: savedCategory.deletedAt?.toISOString(),
    };
  }
}
