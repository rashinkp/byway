import { Money } from "../value-object/money.value-object";

export class Wallet {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public balance: Money
  ) {}

  static create(id: string, userId: string, initialBalance: Money): Wallet {
    return new Wallet(id, userId, initialBalance);
  }

  addAmount(amount: Money): void {
    this.balance = this.balance.add(amount);
  }

  reduceAmount(amount: Money): void {
    this.balance = this.balance.subtract(amount);
  }
}
