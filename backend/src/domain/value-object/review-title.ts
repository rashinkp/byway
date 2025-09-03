export class ReviewTitle {
  private readonly _value: string;

  constructor(value: string) {
    this._validate(value);
    this._value = value.trim();
  }

  private _validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error("Review title cannot be empty");
    }
    if (value.trim().length > 100) {
      throw new Error("Review title cannot exceed 100 characters");
    }
  }

  get value(): string {
    return this._value;
  }

  get length(): number {
    return this._value.length;
  }

  isEmpty(): boolean {
    return this._value.length === 0;
  }

  equals(other: ReviewTitle): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
} 