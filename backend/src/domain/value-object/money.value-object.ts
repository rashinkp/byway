export class Money {
  private constructor(
    public readonly _amount: number,
    public readonly _currency: string = "USD"
  ) {
    if (_amount < 0) {
      throw new Error("Amount cannot be negative");
    }
  }

  static create(amount: number, currency: string = "USD"): Money {
    return new Money(amount, currency);
  }

  add(other: Money): Money {
    if (this._currency !== other._currency) {
      throw new Error("Cannot add money with different currencies");
    }
    return new Money(this._amount + other._amount, this._currency);
  }

  subtract(other: Money): Money {
    if (this._currency !== other._currency) {
      throw new Error("Cannot subtract money with different currencies");
    }
    if (this._amount < other._amount) {
      throw new Error("Insufficient balance");
    }
    return new Money(this._amount - other._amount, this._currency);
  }

  equals(other: Money): boolean {
    return this._amount === other._amount && this._currency === other._currency;
  }

  toString(): string {
    return `${this._amount} ${this._currency}`;
  }
}
