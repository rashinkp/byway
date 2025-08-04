export class UserProfile {
  private readonly _id: string;
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

  constructor(props: {
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
  }) {
    this.validateUserProfile(props);
    
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

  private validateUserProfile(props: any): void {
    if (!props.id) {
      throw new Error("Profile ID is required");
    }

    if (!props.userId) {
      throw new Error("User ID is required");
    }

    if (props.bio && props.bio.length > 500) {
      throw new Error("Bio cannot exceed 500 characters");
    }

    if (props.education && props.education.length > 200) {
      throw new Error("Education cannot exceed 200 characters");
    }

    if (props.skills && props.skills.length > 300) {
      throw new Error("Skills cannot exceed 300 characters");
    }

    if (props.phoneNumber && !this.isValidPhoneNumber(props.phoneNumber)) {
      throw new Error("Invalid phone number format");
    }

    if (props.country && props.country.length > 100) {
      throw new Error("Country cannot exceed 100 characters");
    }

    if (props.city && props.city.length > 100) {
      throw new Error("City cannot exceed 100 characters");
    }

    if (props.address && props.address.length > 300) {
      throw new Error("Address cannot exceed 300 characters");
    }

    if (props.dateOfBirth && props.dateOfBirth > new Date()) {
      throw new Error("Date of birth cannot be in the future");
    }

    if (props.gender && !['male', 'female', 'other', 'prefer-not-to-say'].includes(props.gender.toLowerCase())) {
      throw new Error("Invalid gender value");
    }
  }

  private isValidPhoneNumber(phoneNumber: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phoneNumber.replace(/[\s\-\(\)]/g, ''));
  }

  // Getters
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

  // Business logic methods
  update(props: {
    bio?: string;
    education?: string;
    skills?: string;
    phoneNumber?: string;
    country?: string;
    city?: string;
    address?: string;
    dateOfBirth?: Date;
    gender?: string;
  }): void {
    if (props.bio !== undefined) {
      if (props.bio && props.bio.length > 500) {
        throw new Error("Bio cannot exceed 500 characters");
      }
      this._bio = props.bio;
    }

    if (props.education !== undefined) {
      if (props.education && props.education.length > 200) {
        throw new Error("Education cannot exceed 200 characters");
      }
      this._education = props.education;
    }

    if (props.skills !== undefined) {
      if (props.skills && props.skills.length > 300) {
        throw new Error("Skills cannot exceed 300 characters");
      }
      this._skills = props.skills;
    }

    if (props.phoneNumber !== undefined) {
      if (props.phoneNumber && !this.isValidPhoneNumber(props.phoneNumber)) {
        throw new Error("Invalid phone number format");
      }
      this._phoneNumber = props.phoneNumber;
    }

    if (props.country !== undefined) {
      if (props.country && props.country.length > 100) {
        throw new Error("Country cannot exceed 100 characters");
      }
      this._country = props.country;
    }

    if (props.city !== undefined) {
      if (props.city && props.city.length > 100) {
        throw new Error("City cannot exceed 100 characters");
      }
      this._city = props.city;
    }

    if (props.address !== undefined) {
      if (props.address && props.address.length > 300) {
        throw new Error("Address cannot exceed 300 characters");
      }
      this._address = props.address;
    }

    if (props.dateOfBirth !== undefined) {
      if (props.dateOfBirth && props.dateOfBirth > new Date()) {
        throw new Error("Date of birth cannot be in the future");
      }
      this._dateOfBirth = props.dateOfBirth;
    }

    if (props.gender !== undefined) {
      if (props.gender && !['male', 'female', 'other', 'prefer-not-to-say'].includes(props.gender.toLowerCase())) {
        throw new Error("Invalid gender value");
      }
      this._gender = props.gender;
    }

    this._updatedAt = new Date();
  }

  hasBio(): boolean {
    return this._bio !== undefined && this._bio.trim() !== "";
  }

  hasEducation(): boolean {
    return this._education !== undefined && this._education.trim() !== "";
  }

  hasSkills(): boolean {
    return this._skills !== undefined && this._skills.trim() !== "";
  }

  hasPhoneNumber(): boolean {
    return this._phoneNumber !== undefined && this._phoneNumber.trim() !== "";
  }

  hasLocation(): boolean {
    return (this._country !== undefined && this._country.trim() !== "") ||
           (this._city !== undefined && this._city.trim() !== "");
  }

  hasAddress(): boolean {
    return this._address !== undefined && this._address.trim() !== "";
  }

  hasDateOfBirth(): boolean {
    return this._dateOfBirth !== undefined;
  }

  hasGender(): boolean {
    return this._gender !== undefined && this._gender.trim() !== "";
  }

  getAge(): number | undefined {
    if (!this._dateOfBirth) return undefined;
    
    const today = new Date();
    const birthDate = new Date(this._dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
}
