interface UserProfileInterface {
  id: string;
  userId: string;
  bio?: string;
  education?: string;
  skills?: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  address?: string;
  dateOfBirth?: Date;
  gender?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserProfile {
  private _id: string;
  private _userId: string;
  private _bio?: string;
  private _education?: string;
  private _skills?: string;
  private _phoneNumber?: string;
  private _country?: string;
  private _city?: string;
  private _address?: string;
  private _dateOfBirth?: Date;
  private _gender?: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: UserProfileInterface) {
    this._id = props.id;
    this._userId = props.userId;
    this._bio = props.bio;
    this._education = props.education;
    this._skills = props.skills;
    this._phoneNumber = props.phoneNumber;
    this._country = props.country;
    this._city = props.city;
    this._address = props.address;
    this._dateOfBirth = props.dateOfBirth;
    this._gender = props.gender;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  // Create method with explicit parameters
  static create(
    userId: string,
    options?: {
      bio?: string;
      education?: string;
      skills?: string;
      phoneNumber?: string;
      country?: string;
      city?: string;
      address?: string;
      dateOfBirth?: Date;
      gender?: string;
    }
  ): UserProfile {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const now = new Date();

    return new UserProfile({
      id: crypto.randomUUID(),
      userId,
      bio: options?.bio,
      education: options?.education,
      skills: options?.skills,
      phoneNumber: options?.phoneNumber,
      country: options?.country,
      city: options?.city,
      address: options?.address,
      dateOfBirth: options?.dateOfBirth,
      gender: options?.gender,
      createdAt: now,
      updatedAt: now,
    });
  }

  // Update method with explicit parameters
  static update(
    existingProfile: UserProfile,
    updates: {
      bio?: string;
      education?: string;
      skills?: string;
      phoneNumber?: string;
      country?: string;
      city?: string;
      address?: string;
      dateOfBirth?: Date;
      gender?: string;
    }
  ): UserProfile {
    const updatedProps: UserProfileInterface = {
      ...existingProfile.getProps(),
      updatedAt: new Date(),
    };

    if (updates.bio !== undefined) updatedProps.bio = updates.bio;
    if (updates.education !== undefined)
      updatedProps.education = updates.education;
    if (updates.skills !== undefined) updatedProps.skills = updates.skills;
    if (updates.phoneNumber !== undefined)
      updatedProps.phoneNumber = updates.phoneNumber;
    if (updates.country !== undefined) updatedProps.country = updates.country;
    if (updates.city !== undefined) updatedProps.city = updates.city;
    if (updates.address !== undefined) updatedProps.address = updates.address;
    if (updates.dateOfBirth !== undefined)
      updatedProps.dateOfBirth = updates.dateOfBirth;
    if (updates.gender !== undefined) updatedProps.gender = updates.gender;

    return new UserProfile(updatedProps);
  }

  static fromPersistence(data: {
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
  }): UserProfile {
    return new UserProfile({
      id: data.id,
      userId: data.userId,
      bio: data.bio ?? undefined,
      education: data.education ?? undefined,
      skills: data.skills ?? undefined,
      phoneNumber: data.phoneNumber ?? undefined,
      country: data.country ?? undefined,
      city: data.city ?? undefined,
      address: data.address ?? undefined,
      dateOfBirth: data.dateOfBirth ?? undefined,
      gender: data.gender ?? undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get bio(): string | undefined {
    return this._bio;
  }

  get education(): string | undefined {
    return this._education;
  }

  get skills(): string | undefined {
    return this._skills;
  }

  get phoneNumber(): string | undefined {
    return this._phoneNumber;
  }

  get country(): string | undefined {
    return this._country;
  }

  get city(): string | undefined {
    return this._city;
  }

  get address(): string | undefined {
    return this._address;
  }

  get dateOfBirth(): Date | undefined {
    return this._dateOfBirth;
  }

  get gender(): string | undefined {
    return this._gender;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  private _getProps(): UserProfileInterface {
    return {
      id: this._id,
      userId: this._userId,
      bio: this._bio,
      education: this._education,
      skills: this._skills,
      phoneNumber: this._phoneNumber,
      country: this._country,
      city: this._city,
      address: this._address,
      dateOfBirth: this._dateOfBirth,
      gender: this._gender,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  toJSON(): UserProfileInterface {
    return this._getProps();
  }
}
