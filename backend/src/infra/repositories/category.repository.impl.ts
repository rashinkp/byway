import { PrismaClient } from "@prisma/client";
import { Category } from "../../domain/entities/category.entity";
import { ICategoryRepository } from "../../app/repositories/category.repository";
import { PaginationFilter } from "../../domain/types/pagination-filter.interface";
import { GenericRepository } from "./base/generic.repository";

export class CategoryRepository extends GenericRepository<Category> implements ICategoryRepository {
  constructor(private _prisma: PrismaClient) {
    super(_prisma, 'category');
  }

  protected getPrismaModel() {
    return this._prisma.category;
  }

  protected mapToEntity(data: any): Category {
    return Category.fromPersistence(data);
  }

  protected mapToPrismaData(entity: any): any {
    if (entity instanceof Category) {
      return {
        id: entity.id,
        name: entity.name,
        description: entity.description,
        createdBy: entity.createdBy,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        deletedAt: entity.deletedAt,
      };
    }
    return entity;
  }

  async findById(id: string): Promise<Category | null> {
    return this.findByIdGeneric(id);
  }

  // Generic repository methods
  async create(category: Category): Promise<Category> {
    return this.createGeneric(category);
  }

  async find(filter?: any): Promise<Category[]> {
    return this.findGeneric(filter);
  }

  async update(id: string, category: Category): Promise<Category> {
    return this.updateGeneric(id, category);
  }

  async delete(id: string): Promise<void> {
    return this.deleteGeneric(id);
  }

  async softDelete(id: string): Promise<Category> {
    const deleted = await this._prisma.category.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return this.mapToEntity(deleted);
  }

  async count(filter?: any): Promise<number> {
    return this.countGeneric(filter);
  }

  async save(category: Category): Promise<Category> {
    const data = {
      id: category.id,
      name: category.name,
      description: category.description,
      createdBy: category.createdBy,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      deletedAt: category.deletedAt ? category.deletedAt : null,
    };

    const saved = await this._prisma.category.upsert({
      where: { id: category.id },
      update: data,
      create: data,
    });

    return Category.fromPersistence(saved);
  }

  async findByName(name: string): Promise<Category | null> {
    const category = await this._prisma.category.findUnique({ where: { name } });
    if (!category) return null;
    return Category.fromPersistence(category);
  }

  async findAll(
    input: PaginationFilter
  ): Promise<{ categories: Category[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      search = "",
      includeDeleted = false,
      sortBy = "createdAt",
      sortOrder = "asc",
      filterBy = "all",
    } = input;

    const where: Record<string, unknown> = {};
    if (!includeDeleted && filterBy !== "Inactive") {
      where.deletedAt = null;
    }
    if (filterBy === "Inactive") {
      where.deletedAt = { not: null };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [categories, total] = await Promise.all([
      this._prisma.category.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this._prisma.category.count({ where }),
    ]);

    return {
      categories: categories.map((category) =>
        Category.fromPersistence(category)
      ),
      total,
    };
  }
}
