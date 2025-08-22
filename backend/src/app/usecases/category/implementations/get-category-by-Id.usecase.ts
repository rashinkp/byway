import { ICategoryRepository } from "../../../repositories/category.repository";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { IGetCategoryByIdUseCase } from "../interfaces/get-cateogry-by-Id.usecase.interface";
import {
  ICategoryIdInputDTO,
  ICategoryOutputDTO,
} from "../../../dtos/category.dto";

export class GetCategoryByIdUseCase implements IGetCategoryByIdUseCase {
  constructor(private _categoryRepository: ICategoryRepository) {}

  async execute(input: ICategoryIdInputDTO): Promise<ICategoryOutputDTO> {
    const category = await this._categoryRepository.findById(input.id);
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
