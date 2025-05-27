interface InstructorInterface {
  id: string;
  userId: string;
  areaOfExpertise: string;
  professionalExperience: string;
  about?: string;
  website?: string;
  education: string;
  certifications: string;
  cv: string;
  status: "PENDING" | "APPROVED" | "DECLINED";
  totalStudents: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Instructor {
  private _id: string;
  private _userId: string;
  private _areaOfExpertise: string;
  private _professionalExperience: string;
  private _about?: string;
  private _website?: string;
  private _education: string;
  private _certifications: string;
  private _cv: string;
  private _status: "PENDING" | "APPROVED" | "DECLINED";
  private _totalStudents: number;
  private _createdAt: Date;
  private _updatedAt: Date;

  static create(dto: {
    userId: string;
    areaOfExpertise: string;
    professionalExperience: string;
    about?: string;
    website?: string;
    education: string;
    certifications: string;
    cv: string;
  }): Instructor {
    if (!dto.userId || !dto.areaOfExpertise || !dto.professionalExperience || !dto.education || !dto.cv) {
      throw new Error("Required fields are missing");
    }

    return new Instructor({
      id: crypto.randomUUID(),
      userId: dto.userId,
      areaOfExpertise: dto.areaOfExpertise,
      professionalExperience: dto.professionalExperience,
      about: dto.about,
      website: dto.website,
      education: dto.education,
      certifications: dto.certifications,
      cv: dto.cv,
      status: "PENDING",
      totalStudents: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static update(existingInstructor: Instructor, dto: {
    id: string;
    areaOfExpertise?: string;
    professionalExperience?: string;
    about?: string;
    website?: string;
    education?: string;
    certifications?: string;
    cv?: string;
    status?: "PENDING" | "APPROVED" | "DECLINED";
  }): Instructor {
    if (existingInstructor._id !== dto.id) {
      throw new Error("Cannot update instructor with mismatched ID");
    }

    const updatedProps: InstructorInterface = {
      ...existingInstructor.getProps(),
      updatedAt: new Date(),
    };

    if (dto.areaOfExpertise) updatedProps.areaOfExpertise = dto.areaOfExpertise;
    if (dto.professionalExperience) updatedProps.professionalExperience = dto.professionalExperience;
    if (dto.about !== undefined) updatedProps.about = dto.about;
    if (dto.website !== undefined) updatedProps.website = dto.website;
    if (dto.education) updatedProps.education = dto.education;
    if (dto.certifications !== undefined) updatedProps.certifications = dto.certifications;
    if (dto.cv) updatedProps.cv = dto.cv;
    if (dto.status) updatedProps.status = dto.status;

    return new Instructor(updatedProps);
  }

  static fromPrisma(data: {
    id: string;
    userId: string;
    areaOfExpertise: string;
    professionalExperience: string;
    about?: string | null;
    website?: string | null;
    education: string;
    certifications: string;
    cv: string;
    status: string;
    totalStudents: number;
    createdAt: Date;
    updatedAt: Date;
  }): Instructor {
    return new Instructor({
      id: data.id,
      userId: data.userId,
      areaOfExpertise: data.areaOfExpertise,
      professionalExperience: data.professionalExperience,
      about: data.about ?? undefined,
      website: data.website ?? undefined,
      education: data.education,
      certifications: data.certifications,
      cv: data.cv,
      status: data.status as "PENDING" | "APPROVED" | "DECLINED",
      totalStudents: data.totalStudents,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  private constructor(props: InstructorInterface) {
    this._id = props.id;
    this._userId = props.userId;
    this._areaOfExpertise = props.areaOfExpertise;
    this._professionalExperience = props.professionalExperience;
    this._about = props.about;
    this._website = props.website;
    this._education = props.education;
    this._certifications = props.certifications;
    this._cv = props.cv;
    this._status = props.status;
    this._totalStudents = props.totalStudents;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get areaOfExpertise(): string {
    return this._areaOfExpertise;
  }

  get professionalExperience(): string {
    return this._professionalExperience;
  }

  get about(): string | undefined {
    return this._about;
  }

  get website(): string | undefined {
    return this._website;
  }

  get education(): string {
    return this._education;
  }

  get certifications(): string {
    return this._certifications;
  }

  get cv(): string {
    return this._cv;
  }

  get status(): "PENDING" | "APPROVED" | "DECLINED" {
    return this._status;
  }

  get totalStudents(): number {
    return this._totalStudents;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  approve(): void {
    if (this._status === "APPROVED") {
      throw new Error("Instructor is already approved");
    }
    this._status = "APPROVED";
    this._updatedAt = new Date();
  }

  decline(): void {
    if (this._status === "DECLINED") {
      throw new Error("Instructor is already declined");
    }
    this._status = "DECLINED";
    this._updatedAt = new Date();
  }

  private getProps(): InstructorInterface {
    return {
      id: this._id,
      userId: this._userId,
      areaOfExpertise: this._areaOfExpertise,
      professionalExperience: this._professionalExperience,
      about: this._about,
      website: this._website,
      education: this._education,
      certifications: this._certifications,
      cv: this._cv,
      status: this._status,
      totalStudents: this._totalStudents,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
