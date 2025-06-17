export class ReviewComment {
  private readonly _value: string;

  constructor(value: string) {
    this.validate(value);
    this._value = value.trim();
  }

  private validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error("Review comment cannot be empty");
    }
    if (value.trim().length > 1000) {
      throw new Error("Review comment cannot exceed 1000 characters");
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

  getWordCount(): number {
    return this._value.split(/\s+/).filter(word => word.length > 0).length;
  }

  equals(other: ReviewComment): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
} 