import { v4 as uuid } from "uuid";

export class CategoryName {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.trim() === "") {
      throw new Error("Category name cannot be empty");
    }
    if (value.length > 100) {
      throw new Error("Category name cannot exceed 100 characters");
    }
    this._value = value.trim();
  }

  get value(): string {
    return this._value;
  }

  equals(other: CategoryName): boolean {
    return this._value === other._value;
  }
}

interface CategoryProps {
  id: string;
  name: CategoryName;
  description?: string;
  createdBy: string; 
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export class Category {
  private _id: string;
  private _name: CategoryName;
  private _description?: string;
  private _createdBy: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt?: Date;

  // Private constructor to enforce factory method usage
  private constructor(props: CategoryProps) {
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;
    this._createdBy = props.createdBy;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._deletedAt = props.deletedAt;
  }

  // Static factory method to create a new Category
  static create(dto: {
    name: string;
    description?: string;
    createdBy: string;
  }): Category {
    if (!dto.createdBy) {
      throw new Error("Creator ID is required");
    }

    return new Category({
      id: uuid(),
      name: new CategoryName(dto.name),
      description: dto.description?.trim(),
      createdBy: dto.createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: undefined,
    });
  }

  // Static factory method to update an existing Category
  static update(
    existingCategory: Category,
    dto: {
      name?: string;
      description?: string;
    }
  ): Category {
    const props: CategoryProps = {
      ...existingCategory.getProps(),
      updatedAt: new Date(),
    };

    if (dto.name && dto.name.trim() !== "") {
      props.name = new CategoryName(dto.name);
    }

    if (dto.description !== undefined) {
      props.description = dto.description?.trim();
    }

    return new Category(props);
  }

  // Static factory method to create from persistence layer (e.g., Prisma)
  static fromPersistence(data: {
    id: string;
    name: string;
    description?: string | null;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
  }): Category {
    return new Category({
      id: data.id,
      name: new CategoryName(data.name),
      description: data.description ?? undefined,
      createdBy: data.createdBy,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt ?? undefined,
    });
  }

  // Method to soft delete
  softDelete(): void {
    if (this._deletedAt) {
      throw new Error("Category is already deleted");
    }
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }

  // Method to recover a soft-deleted category
  recover(): void {
    if (!this._deletedAt) {
      throw new Error("Category is not deleted");
    }
    this._deletedAt = undefined;
    this._updatedAt = new Date();
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name.value;
  }

  get description(): string | undefined {
    return this._description;
  }

  get createdBy(): string {
    return this._createdBy;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get deletedAt(): Date | undefined {
    return this._deletedAt;
  }

  // Helper method to get all properties (for internal use)
  private getProps(): CategoryProps {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      createdBy: this._createdBy,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      deletedAt: this._deletedAt,
    };
  }

  // Method to check if category is active (not deleted)
  isActive(): boolean {
    return !this._deletedAt;
  }
}
