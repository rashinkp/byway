export class FileUrl {
  private readonly _value: string | null;

  constructor(value: string | null) {
    if (value != null) {
      const isHttpUrl = value.startsWith("http://") || value.startsWith("https://");

      if (isHttpUrl) {
        try {
          new URL(value);
        } catch {
          throw new Error("Invalid URL format for fileUrl");
        }
      } else {
        // Accept S3 object keys or other storage keys as non-empty strings without whitespace
        if (value.trim().length === 0) {
          throw new Error("fileUrl cannot be empty");
        }
        if (/\s/.test(value)) {
          throw new Error("fileUrl cannot contain whitespace");
        }
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
