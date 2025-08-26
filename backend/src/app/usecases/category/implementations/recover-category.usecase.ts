import {
  ICategoryIdInputDTO,
  ICategoryOutputDTO,
} from "../../../dtos/category.dto";
import { ICategoryRepository } from "../../../repositories/category.repository";
import { IRecoverCategoryUseCase } from "../interfaces/recover-category.usecase.interface";
import { CategoryNotFoundError, CategoryValidationError } from "../../../../domain/errors/domain-errors";

export class RecoverCategoryUseCase implements IRecoverCategoryUseCase {
  constructor(private _categoryRepository: ICategoryRepository) {}

  async execute(input: ICategoryIdInputDTO): Promise<ICategoryOutputDTO> {
    const category = await this._categoryRepository.findById(input.id);
    if (!category) {
      throw new CategoryNotFoundError(input.id);
    }
    if (category.isActive()) {
      throw new CategoryValidationError("Category is not deleted");
    }

    category.recover();
    const savedCategory = await this._categoryRepository.save(category);

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
