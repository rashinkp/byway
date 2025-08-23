export class Timestamp {
  constructor(public readonly value: Date) {}
  
  toString(): string {
    return this.value.toISOString();
  }
  
  toDate(): Date {
    return this.value;
  }
} 