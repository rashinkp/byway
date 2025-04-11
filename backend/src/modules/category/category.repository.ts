import { PrismaClient } from "@prisma/client";
import {
  ICategory,
  ICreateCategoryInput,
  IUpdateCategoryInput,
  IGetAllCategoriesInput,
} from "./types";

export interface ICategoryRepository {
  createCategory(input: ICreateCategoryInput): Promise<ICategory>;
  getAllCategories(
    input: IGetAllCategoriesInput
  ): Promise<{ categories: ICategory[]; total: number }>;
  getCategoryById(id: string): Promise<ICategory | null>;
  updateCategory(input: IUpdateCategoryInput): Promise<ICategory>;
  deleteCategory(id: string): Promise<ICategory>;
  getCategoryByName(name: string): Promise<ICategory | null>;
}

export class CategoryRepository implements ICategoryRepository {
  constructor(private prisma: PrismaClient) {}

  async createCategory(input: ICreateCategoryInput): Promise<ICategory> {
    const { name, description, createdBy } = input;
    const category = await this.prisma.category.create({
      data: {
        name,
        description,
        createdBy,
      },
    });
    return {
      id: category.id,
      name: category.name,
      description: category.description || undefined,
      createdBy: category.createdBy,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  async getAllCategories(
    input: IGetAllCategoriesInput
  ): Promise<{ categories: ICategory[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "asc",
      includeDeleted,
    } = input;
    const skip = (page - 1) * limit;

    const where = includeDeleted ? {} : { deletedAt: null };
    const orderBy = { [sortBy]: sortOrder };

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          name: true,
          description: true,
          createdBy: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
      }),
      this.prisma.category.count({ where }),
    ]);

    return {
      categories: categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        description: cat.description || undefined,
        createdBy: cat.createdBy,
        createdAt: cat.createdAt,
        updatedAt: cat.updatedAt,
        deletedAt: cat.deletedAt || undefined,
      })),
      total,
    };
  }

  async getCategoryById(id: string): Promise<ICategory | null> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return category
      ? { ...category, description: category.description || undefined }
      : null;
  }

  async updateCategory(input: IUpdateCategoryInput): Promise<ICategory> {
    const { id, name, description } = input;
    console.log(id, name, description);
    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: {
        name,
        description,
        updatedAt: new Date(),
      },
    });
    return {
      id: updatedCategory.id,
      name: updatedCategory.name,
      description: updatedCategory.description || undefined,
      createdBy: updatedCategory.createdBy,
      createdAt: updatedCategory.createdAt,
      updatedAt: updatedCategory.updatedAt,
    };
  }

  async deleteCategory(id: string): Promise<ICategory> {
    //todo toggle delete
    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return {
      id: updatedCategory.id,
      name: updatedCategory.name,
      description: updatedCategory.description || undefined,
      createdBy: updatedCategory.createdBy,
      createdAt: updatedCategory.createdAt,
      updatedAt: updatedCategory.updatedAt,
      deletedAt: updatedCategory.deletedAt || undefined,
    };
  }

  async getCategoryByName(name: string): Promise<ICategory | null> {
    const category = await this.prisma.category.findUnique({
      where: { name },
      select: {
        id: true,
        name: true,
        description: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
    return category
      ? {
          id: category.id,
          name: category.name,
          description: category.description || undefined,
          createdBy: category.createdBy,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
          deletedAt: category.deletedAt || undefined,
        }
      : null;
  }
}
