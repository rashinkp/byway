import { PrismaClient } from "@prisma/client";
import { Category } from "../../domain/entities/category.entity";
import { ICategoryRepository } from "../../app/repositories/category.repository";
import { PaginationFilter } from "../../domain/types/pagination-filter.interface";


export class CategoryRepository implements ICategoryRepository {
  constructor(private _prisma: PrismaClient) {}

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

  async findById(id: string): Promise<Category | null> {
    const category = await this._prisma.category.findUnique({ where: { id } });
    if (!category) return null;
    return Category.fromPersistence(category);
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
