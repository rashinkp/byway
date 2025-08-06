interface UserProfileProps {
  id: string;
  userId: string;
  bio?: string | null;
  education?: string | null;
  skills?: string | null;
  phoneNumber?: string | null;
  country?: string | null;
  city?: string | null;
  address?: string | null;
  dateOfBirth?: Date | null;
  gender?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export class UserProfile {
  private readonly _id: string;
  private readonly _userId: string;
  private readonly _bio: string | null;
  private readonly _education: string | null;
  private readonly _skills: string | null;
  private readonly _phoneNumber: string | null;
  private readonly _country: string | null;
  private readonly _city: string | null;
  private readonly _address: string | null;
  private readonly _dateOfBirth: Date | null;
  private readonly _gender: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date | null;

  constructor(props: UserProfileProps) {
    if (!props.userId) {
      throw new Error("User ID is required");
    }

    this._id = props.id;
    this._userId = props.userId;
    this._bio = props.bio ? props.bio.trim() : null;
    this._education = props.education ? props.education.trim() : null;
    this._skills = props.skills ? props.skills.trim() : null;
    this._phoneNumber = props.phoneNumber ? props.phoneNumber.trim() : null;
    this._country = props.country ? props.country.trim() : null;
    this._city = props.city ? props.city.trim() : null;
    this._address = props.address ? props.address.trim() : null;
    this._dateOfBirth = props.dateOfBirth ?? null;
    this._gender = props.gender ? props.gender.trim() : null;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._deletedAt = props.deletedAt ?? null;
  }

  softDelete(): void {
    if (this._deletedAt) {
      throw new Error("User profile is already deleted");
    }
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }

  recover(): void {
    if (!this._deletedAt) {
      throw new Error("User profile is not deleted");
    }
    this._deletedAt = null;
    this._updatedAt = new Date();
  }

  isActive(): boolean {
    return !this._deletedAt;
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get bio(): string | null {
    return this._bio;
  }

  get education(): string | null {
    return this._education;
  }

  get skills(): string | null {
    return this._skills;
  }

  get phoneNumber(): string | null {
    return this._phoneNumber;
  }

  get country(): string | null {
    return this._country;
  }

  get city(): string | null {
    return this._city;
  }

  get address(): string | null {
    return this._address;
  }

  get dateOfBirth(): Date | null {
    return this._dateOfBirth;
  }

  get gender(): string | null {
    return this._gender;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }
}
