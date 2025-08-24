import { Decimal } from "@prisma/client/runtime/library";

export class Price {
  private constructor(private readonly _value: Decimal | null) {}

  static create(value: number | null): Price {
    if (value != null && value < 0) {
      throw new Error("Price cannot be negative");
    }
    return new Price(value != null ? new Decimal(value) : null);
  }

  getValue(): Decimal | null {
    return this._value;
  }
}
