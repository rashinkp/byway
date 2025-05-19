import { ICreateCategoryUseCase } from "../interfaces/create-category.usecase.interface";
import { ICategoryRepository } from "../../../repositories/category.repository";
import { IUserRepository } from "../../../repositories/user.repository";
import { Role } from "../../../../domain/enum/role.enum";
import { HttpError } from "../../../../presentation/http/utils/HttpErrors";
import { ICategoryOutputDTO, ICreateCategoryInputDTO } from "../../../../domain/dtos/category/category.dto";
import { Category } from "../../../../domain/entities/category.entity";

export class CreateCategoryUseCase implements ICreateCategoryUseCase {
  constructor(
    private categoryRepository: ICategoryRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(input: ICreateCategoryInputDTO): Promise<ICategoryOutputDTO> {
    // Validate user is an admin
    const user = await this.userRepository.findById(input.createdBy);
    if (!user) {
      throw new HttpError("User not found", 404);
    }
    if (user.role !== Role.ADMIN) {
      throw new HttpError("Only admins can create categories", 403);
    }

    // Check for existing category
    const existingCategory = await this.categoryRepository.findByName(
      input.name
    );
    if (existingCategory && existingCategory.isActive()) {
      throw new HttpError("A category with this name already exists", 400);
    }

    // Create category entity
    const category = Category.create({
      name: input.name,
      description: input.description,
      createdBy: input.createdBy,
    });

    // Persist category
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
