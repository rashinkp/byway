export class Offer {
  private constructor(private readonly _value: number | null) {}

  static create(value: number | null): Offer {
    if (value != null && (value < 0 || value > 100)) {
      throw new Error("Offer must be between 0 and 100");
    }
    return new Offer(value);
  }

  getValue(): number | null {
    return this._value;
  }

  // Helper method for database operations (used by infrastructure layer)
  toDatabase(): string | null {
    return this._value?.toString() || null;
  }

  // Helper method to create from database value
  static fromDatabase(value: string | null): Offer {
    if (value === null) return new Offer(null);
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      throw new Error("Invalid offer value from database");
    }
    return new Offer(numValue);
  }
}
