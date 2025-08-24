export class Rating {
  private readonly _value: number;

  constructor(value: number) {
    this._validate(value);
    this._value = value;
  }

  private _validate(value: number): void {
    if (!Number.isInteger(value)) {
      throw new Error("Rating must be an integer");
    }
    if (value < 1 || value > 5) {
      throw new Error("Rating must be between 1 and 5");
    }
  }

  get value(): number {
    return this._value;
  }

  // Business methods
  isExcellent(): boolean {
    return this._value === 5;
  }

  isGood(): boolean {
    return this._value >= 4;
  }

  isAverage(): boolean {
    return this._value === 3;
  }

  isPoor(): boolean {
    return this._value <= 2;
  }

  getStars(): string {
    return "★".repeat(this._value) + "☆".repeat(5 - this._value);
  }

  getTextRating(): string {
    switch (this._value) {
      case 1: return "Very Poor";
      case 2: return "Poor";
      case 3: return "Average";
      case 4: return "Good";
      case 5: return "Excellent";
      default: return "Unknown";
    }
  }

  equals(other: Rating): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value.toString();
  }
} 