import { Decimal } from "@prisma/client/runtime/library";

export class Offer {
  private constructor(private readonly _value: Decimal | null) {}

  static create(value: number | null): Offer {
    if (value != null && (value < 0 || value > 100)) {
      throw new Error("Offer must be between 0 and 100");
    }
    return new Offer(value != null ? new Decimal(value) : null);
  }

  getValue(): Decimal | null {
    return this._value;
  }
}
