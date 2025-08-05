import { PrismaClient } from "@prisma/client";
import { CategoryRecord } from "../../app/records/category.record";
import { ICategoryRepository } from "../../app/repositories/category.repository";

export class CategoryRepository implements ICategoryRepository {
  constructor(private prisma: PrismaClient) {}

  async save(category: CategoryRecord): Promise<CategoryRecord> {
    const saved = await this.prisma.category.upsert({
      where: { id: category.id },
      update: category,
      create: category,
    });

    return saved;
  }

  async findById(id: string): Promise<CategoryRecord | null> {
    const category = await this.prisma.category.findUnique({ where: { id } });
    return category;
  }

  async findByName(name: string): Promise<CategoryRecord | null> {
    const category = await this.prisma.category.findUnique({ where: { name } });
    return category;
  }

  async findAll(options: {
    page?: number;
    limit?: number;
    search?: string;
    includeDeleted?: boolean;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    filterBy?: string;
  }): Promise<{ categories: CategoryRecord[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      search = "",
      includeDeleted = false,
      sortBy = "createdAt",
      sortOrder = "asc",
      filterBy = "all",
    } = options;

    const where: any = {};
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
      this.prisma.category.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.category.count({ where }),
    ]);

    return {
      categories,
      total,
    };
  }
}
