import { Money } from "../value-object/money.value-object";

export class Wallet {
  private readonly _id: string;
  private readonly _userId: string;
  private _balance: Money;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: {
    id: string;
    userId: string;
    balance: Money;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.validateWallet(props);
    
    this._id = props.id;
    this._userId = props.userId;
    this._balance = props.balance;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  private validateWallet(props: any): void {
    if (!props.id) {
      throw new Error("Wallet ID is required");
    }

    if (!props.userId) {
      throw new Error("User ID is required");
    }

    if (!props.balance) {
      throw new Error("Balance is required");
    }
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get balance(): Money {
    return this._balance;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business logic methods
  addAmount(amount: number, currency: string = 'USD'): void {
    if (amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }
    
    const moneyToAdd = Money.create(amount, currency);
    this._balance = this._balance.add(moneyToAdd);
    this._updatedAt = new Date();
  }

  reduceAmount(amount: number, currency: string = 'USD'): void {
    if (amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }
    
    const moneyToReduce = Money.create(amount, currency);
    const newBalance = this._balance.subtract(moneyToReduce);
    
    if (newBalance.amount < 0) {
      throw new Error("Insufficient balance");
    }
    
    this._balance = newBalance;
    this._updatedAt = new Date();
  }

  hasSufficientBalance(amount: number, currency: string = 'USD'): boolean {
    const moneyToCheck = Money.create(amount, currency);
    const newBalance = this._balance.subtract(moneyToCheck);
    return newBalance.amount >= 0;
  }

  getBalanceAmount(): number {
    return this._balance.amount;
  }

  getBalanceCurrency(): string {
    return this._balance.currency;
  }

  isEmpty(): boolean {
    return this._balance.amount === 0;
  }
} 