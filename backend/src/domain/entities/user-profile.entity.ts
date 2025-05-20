import { ICreateUserProfileRequestDTO, IUpdateUserProfileRequestDTO } from "../dtos/user/user.dto";


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

  static create(dto: ICreateUserProfileRequestDTO): UserProfile {
    if (!dto.userId) {
      throw new Error("User ID is required");
    }
    return new UserProfile({
      id: crypto.randomUUID(),
      userId: dto.userId,
      bio: dto.bio,
      education: dto.education,
      skills: dto.skills,
      phoneNumber: dto.phoneNumber,
      country: dto.country,
      city: dto.city,
      address: dto.address,
      dateOfBirth: dto.dateOfBirth,
      gender: dto.gender,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static update(
    existingProfile: UserProfile,
    dto: IUpdateUserProfileRequestDTO
  ): UserProfile {
    if (existingProfile._id !== dto.id) {
      throw new Error("Cannot update profile with mismatched ID");
    }

    const updatedProps: UserProfileInterface = {
      ...existingProfile.getProps(),
      updatedAt: new Date(),
    };

    if (dto.bio !== undefined) updatedProps.bio = dto.bio;
    if (dto.education !== undefined) updatedProps.education = dto.education;
    if (dto.skills !== undefined) updatedProps.skills = dto.skills;
    if (dto.phoneNumber !== undefined)
      updatedProps.phoneNumber = dto.phoneNumber;
    if (dto.country !== undefined) updatedProps.country = dto.country;
    if (dto.city !== undefined) updatedProps.city = dto.city;
    if (dto.address !== undefined) updatedProps.address = dto.address;
    if (dto.dateOfBirth !== undefined)
      updatedProps.dateOfBirth = dto.dateOfBirth;
    if (dto.gender !== undefined) updatedProps.gender = dto.gender;

    return new UserProfile(updatedProps);
  }

  static fromPrisma(data: {
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

  private getProps(): UserProfileInterface {
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
}
