export class Price {
  private constructor(private readonly _value: number | null) {}

  static create(value: number | null): Price {
    if (value != null && value < 0) {
      throw new Error("Price cannot be negative");
    }
    return new Price(value);
  }

  getValue(): number | null {
    return this._value;
  }

  // Helper method for database operations (used by infrastructure layer)
  toDatabase(): string | null {
    return this._value?.toString() || null;
  }

  // Helper method to create from database value
  static fromDatabase(value: string | null): Price {
    if (value === null) return new Price(null);
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      throw new Error("Invalid price value from database");
    }
    return new Price(numValue);
  }
}
