export class LessonOrder {
  private readonly _value: number;

  constructor(value: number) {
    if (!Number.isInteger(value) || value < 0) {
      throw new Error("Lesson order must be a non-negative integer");
    }
    this._value = value;
  }

  get value(): number {
    return this._value;
  }

  equals(other: LessonOrder): boolean {
    return this._value === other._value;
  }
}
