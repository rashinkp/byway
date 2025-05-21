export class FileUrl {
  private readonly _value: string | null;

  constructor(value: string | null) {
    if (value != null) {
      try {
        new URL(value);
      } catch {
        throw new Error("Invalid URL format for fileUrl");
      }
    }
    this._value = value;
  }

  get value(): string | null {
    return this._value;
  }

  equals(other: FileUrl): boolean {
    return this._value === other._value;
  }
}
