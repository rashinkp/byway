import { IUpdateCategoryUseCase } from "../interfaces/update-category.usecase.interface";
import { ICategoryRepository } from "../../../repositories/category.repository";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import {
  ICategoryOutputDTO,
  IUpdateCategoryInputDTO,
} from "../../../dtos/category.dto";
import { Category } from "../../../../domain/entities/category.entity";

export class UpdateCategoryUseCase implements IUpdateCategoryUseCase {
  constructor(private _categoryRepository: ICategoryRepository) {}

  async execute(input: IUpdateCategoryInputDTO): Promise<ICategoryOutputDTO> {
    const category = await this._categoryRepository.findById(input.id);
    if (!category) {
      throw new HttpError("Category not found", 404);
    }

    if (input.name) {
      const existingCategory = await this._categoryRepository.findByName(
        input.name
      );
      if (
        existingCategory &&
        existingCategory.id !== input.id &&
        existingCategory.isActive()
      ) {
        throw new HttpError("A category with this name already exists", 400);
      }
    }

    const updatedCategory = Category.update(
      category,
      input.name,
      input.description
    );

    const savedCategory = await this._categoryRepository.save(updatedCategory);

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
