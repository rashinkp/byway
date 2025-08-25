export class Duration {
  private constructor(private readonly _value: number | null) {}

  static create(value: number | null): Duration {
    if (value != null && value < 0) {
      throw new Error("Duration must be positive");
    }
    return new Duration(value);
  }

  getValue(): number | null {
    return this._value;
  }
}
