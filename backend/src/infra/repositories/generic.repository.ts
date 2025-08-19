import { PrismaClient } from "@prisma/client";

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export abstract class GenericRepository<T> {
  constructor(
    protected readonly prisma: PrismaClient,
    protected readonly modelName: string
  ) {}

  protected abstract getPrismaModel(): any;
  protected abstract mapToEntity(data: any): T;
  protected abstract mapToPrismaData(entity: any): any;

  // ===== Protected generic ops (core) =====
  protected async findByIdGeneric(id: string): Promise<T | null> {
    const found = await this.getPrismaModel().findUnique({
      where: { id, deletedAt: null },
    });
    return found ? this.mapToEntity(found) : null;
  }

  protected async findGeneric(filter?: any): Promise<T[]> {
    const where: any = { deletedAt: null };
    
    if (filter) {
      const prismaFilter = this.mapToPrismaData(filter);
      Object.assign(where, prismaFilter);
    }

    const results = await this.getPrismaModel().findMany({ where });
    return results.map((result: any) => this.mapToEntity(result));
  }

  protected async createGeneric(data: any): Promise<T> {
    const prismaData = this.mapToPrismaData(data);
    const created = await this.getPrismaModel().create({
      data: {
        ...prismaData,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return this.mapToEntity(created);
  }

  protected async updateGeneric(id: string, data: any): Promise<T> {
    const prismaData = this.mapToPrismaData(data);
    const updated = await this.getPrismaModel().update({
      where: { id },
      data: {
        ...prismaData,
        updatedAt: new Date(),
      },
    });
    return this.mapToEntity(updated);
  }

  protected async deleteGeneric(id: string): Promise<void> {
    await this.getPrismaModel().delete({
      where: { id },
    });
  }

  protected async softDeleteGeneric(id: string): Promise<void> {
    await this.getPrismaModel().update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  protected async countGeneric(filter?: any): Promise<number> {
    const where: any = { deletedAt: null };
    
    if (filter) {
      const prismaFilter = this.mapToPrismaData(filter);
      Object.assign(where, prismaFilter);
    }

    return await this.getPrismaModel().count({ where });
  }

  protected createPaginationQuery(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ) {
    return {
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    };
  }

  protected createSearchQuery(search: string, searchFields: string[]) {
    if (!search) return {};
    
    return {
      OR: searchFields.map(field => ({
        [field]: { contains: search, mode: 'insensitive' as const }
      }))
    };
  }

  // ===== Public CRUD wrappers (inherited by concrete repos) =====
  public async create(entity: T): Promise<T> {
    return this.createGeneric(entity);
  }

  public async findById(id: string): Promise<T | null> {
    return this.findByIdGeneric(id);
  }

  public async find(filter?: any): Promise<T[]> {
    return this.findGeneric(filter);
  }

  public async update(id: string, entity: T): Promise<T> {
    return this.updateGeneric(id, entity);
  }

  public async delete(id: string): Promise<void> {
    return this.deleteGeneric(id);
  }

  public async softDelete(id: string): Promise<T> {
    await this.softDeleteGeneric(id);
    const raw = await this.getPrismaModel().findUnique({ where: { id } });
    if (!raw) {
      throw new Error(`Entity not found after soft delete: ${this.modelName} ${id}`);
    }
    return this.mapToEntity(raw);
  }

  public async count(filter?: any): Promise<number> {
    return this.countGeneric(filter);
  }
}
