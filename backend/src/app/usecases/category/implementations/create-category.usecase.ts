import { ICreateCategoryUseCase } from "../interfaces/create-category.usecase.interface";
import { IUserRepository } from "../../../repositories/user.repository";
import { Role } from "../../../../domain/enum/role.enum";
import {
  ICategoryOutputDTO,
  ICreateCategoryInputDTO,
} from "../../../dtos/category.dto";
import { Category } from "../../../../domain/entities/category.entity";
import { ICategoryRepository } from "../../../repositories/category.repository";
import { randomUUID } from "crypto";
import { UserNotFoundError, UserAuthorizationError, CategoryValidationError } from "../../../../domain/errors/domain-errors";

export class CreateCategoryUseCase implements ICreateCategoryUseCase {
  constructor(
    private _categoryRepository: ICategoryRepository,
    private _userRepository: IUserRepository
  ) {}

  async execute(input: ICreateCategoryInputDTO): Promise<ICategoryOutputDTO> {
    // Validate user is an admin
    const user = await this._userRepository.findById(input.createdBy);
    if (!user) {
      throw new UserNotFoundError(input.createdBy);
    }
    if (user.role !== Role.ADMIN) {
      throw new UserAuthorizationError("Only admins can create categories");
    }

    // Check for existing category
    const existingCategory = await this._categoryRepository.findByName(
      input.name
    );
    if (existingCategory && existingCategory.isActive()) {
      throw new CategoryValidationError("A category with this name already exists");
    }

    // Create category entity
    const category = Category.create(
      randomUUID(), // Generate a new UUID for the category
      input.name,
      input.createdBy,
      input.description
    );

    // Persist category
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
