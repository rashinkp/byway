import { IDeleteCategoryUseCase } from "../interfaces/delete-category.usecase.interface";
import { ICategoryRepository } from "../../../repositories/category.repository";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import {
  ICategoryIdInputDTO,
  ICategoryOutputDTO,
} from "../../../dtos/category.dto";

export class DeleteCategoryUseCase implements IDeleteCategoryUseCase {
  constructor(private _categoryRepository: ICategoryRepository) {}

  async execute(input: ICategoryIdInputDTO): Promise<ICategoryOutputDTO> {
    const category = await this._categoryRepository.findById(input.id);
    if (!category) {
      throw new HttpError("Category not found", 404);
    }
    if (!category.isActive()) {
      throw new HttpError("Category is already deleted", 400);
    }

    category.softDelete();
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
