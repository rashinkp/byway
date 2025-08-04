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

export class Category {
  private readonly _id: string;
  private _name: CategoryName;
  private _description?: string;
  private _createdBy: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt?: Date;

  constructor(props: {
    id: string;
    name: CategoryName;
    description?: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
  }) {
    this.validateCategory(props);
    
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;
    this._createdBy = props.createdBy;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._deletedAt = props.deletedAt;
  }

  private validateCategory(props: any): void {
    if (!props.id) {
      throw new Error("Category ID is required");
    }

    if (!props.name) {
      throw new Error("Category name is required");
    }

    if (!props.createdBy) {
      throw new Error("Creator ID is required");
    }

    if (props.description && props.description.length > 500) {
      throw new Error("Category description cannot exceed 500 characters");
    }
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

  // Business logic methods
  update(props: {
    name?: string;
    description?: string;
  }): void {
    if (props.name && props.name.trim() !== "") {
      this._name = new CategoryName(props.name);
    }

    if (props.description !== undefined) {
      if (props.description && props.description.length > 500) {
        throw new Error("Category description cannot exceed 500 characters");
      }
      this._description = props.description?.trim();
    }

    this._updatedAt = new Date();
  }

  softDelete(): void {
    if (this._deletedAt) {
      throw new Error("Category is already deleted");
    }
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }

  recover(): void {
    if (!this._deletedAt) {
      throw new Error("Category is not deleted");
    }
    this._deletedAt = undefined;
    this._updatedAt = new Date();
  }

  isDeleted(): boolean {
    return this._deletedAt !== undefined;
  }

  isActive(): boolean {
    return !this.isDeleted();
  }

  hasDescription(): boolean {
    return this._description !== undefined && this._description.trim() !== "";
  }
}
