import { Money } from "../value-object/money.value-object";

export class Wallet {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public balance: Money,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(
    userId: string,
    initialBalance: number = 0,
    currency: string = 'USD'
  ): Wallet {
    return new Wallet(
      crypto.randomUUID(),
      userId,
      Money.create(initialBalance, currency),
      new Date(),
      new Date()
    );
  }

  addAmount(amount: number, currency: string = 'USD'): void {
    const moneyToAdd = Money.create(amount, currency);
    this.balance = this.balance.add(moneyToAdd);
  }

  reduceAmount(amount: number, currency: string = 'USD'): void {
    const moneyToReduce = Money.create(amount, currency);
    this.balance = this.balance.subtract(moneyToReduce);
  }

  toResponse() {
    return {
      id: this.id,
      userId: this.userId,
      balance: this.balance.amount,
      currency: this.balance.currency,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
} 