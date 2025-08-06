import { CategoryProps } from "../interfaces/category";
import { CategoryName } from "../value-object/category-name";

export class Category {
  private readonly _id: string;
  private _name: CategoryName;
  private _description: string | null;
  private _createdBy: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date | null;

  constructor(props: CategoryProps) {
    if (!props.createdBy) {
      throw new Error("Creator ID is required");
    }

    this._id = props.id;
    this._name = props.name;
    this._description = props.description?.trim() ?? null;
    this._createdBy = props.createdBy;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._deletedAt = props.deletedAt ?? null;
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
    this._deletedAt = null;
    this._updatedAt = new Date();
  }

  isActive(): boolean {
    return !this._deletedAt;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name.value;
  }

  get description(): string | null {
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

  get deletedAt(): Date | null {
    return this._deletedAt;
  }
}
