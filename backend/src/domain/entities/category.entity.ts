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

  private constructor(props: CategoryProps) {
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;
    this._createdBy = props.createdBy;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._deletedAt = props.deletedAt;
  }

  // Now the caller must supply the id
  static create(
    id: string,
    name: string,
    createdBy: string,
    description?: string
  ): Category {
    if (!id || id.trim() === "") {
      throw new Error("Category ID is required");
    }
    if (!createdBy) {
      throw new Error("Creator ID is required");
    }

    return new Category({
      id,
      name: new CategoryName(name),
      description: description?.trim(),
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: undefined,
    });
  }

  static update(
    existingCategory: Category,
    name?: string,
    description?: string
  ): Category {
    const props: CategoryProps = {
      ...existingCategory.getProps(),
      updatedAt: new Date(),
    };

    if (name && name.trim() !== "") {
      props.name = new CategoryName(name);
    }

    if (description !== undefined) {
      props.description = description.trim();
    }

    return new Category(props);
  }

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

  isActive(): boolean {
    return !this._deletedAt;
  }
}
