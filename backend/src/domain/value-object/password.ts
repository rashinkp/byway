export class Password {
  private readonly _value: string;

  private constructor(value: string) {
    if (!value || value.trim() === "") {
      throw new Error("Password cannot be empty");
    }
    if (value.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
      throw new Error("Password must contain at least one lowercase letter, one uppercase letter, and one number");
    }
    this._value = value;
  }

  static create(value: string): Password {
    return new Password(value);
  }

  get value(): string {
    return this._value;
  }

  getLength(): number {
    return this._value.length;
  }

  isStrong(): boolean {
    return this._value.length >= 12 && /(?=.*[!@#$%^&*])/.test(this._value);
  }

  equals(other: Password): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
} 