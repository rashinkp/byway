

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
