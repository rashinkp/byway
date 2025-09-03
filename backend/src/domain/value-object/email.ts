export class Email {
  private _address: string;

  constructor(address: string) {
    if (!this._isValidEmail(address)) {
      throw new Error("Invalid email address");
    }
    this._address = address.toLowerCase();
  }

  private _isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  get address(): string {
    return this._address;
  }

  // Helper method for database operations
  toDatabase(): string {
    return this._address;
  }

  // Helper method to create from database value
  static fromDatabase(value: string): Email {
    return new Email(value);
  }

  // Comparison methods
  equals(other: Email): boolean {
    return this._address === other._address;
  }

  toString(): string {
    return this._address;
  }
}
