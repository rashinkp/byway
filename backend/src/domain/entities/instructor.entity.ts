export class Instructor {
  private readonly _id: string;
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
  private _deletedAt?: Date | null;

  constructor(props: {
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
    deletedAt?: Date | null;
  }) {
    this.validateInstructor(props);
    
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
    this._deletedAt = props.deletedAt;
  }

  private validateInstructor(props: any): void {
    if (!props.id) {
      throw new Error("Instructor ID is required");
    }

    if (!props.userId) {
      throw new Error("User ID is required");
    }

    if (!props.areaOfExpertise || props.areaOfExpertise.trim() === "") {
      throw new Error("Area of expertise is required");
    }

    if (!props.professionalExperience || props.professionalExperience.trim() === "") {
      throw new Error("Professional experience is required");
    }

    if (!props.education || props.education.trim() === "") {
      throw new Error("Education is required");
    }

    if (!props.cv || props.cv.trim() === "") {
      throw new Error("CV is required");
    }

    if (props.totalStudents < 0) {
      throw new Error("Total students cannot be negative");
    }

    if (props.website && !this.isValidUrl(props.website)) {
      throw new Error("Invalid website URL");
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Getters
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

  get deletedAt(): Date | null | undefined {
    return this._deletedAt;
  }

  // Business logic methods
  updateProfile(props: {
    areaOfExpertise?: string;
    professionalExperience?: string;
    about?: string;
    website?: string;
    education?: string;
    certifications?: string;
    cv?: string;
  }): void {
    if (props.areaOfExpertise && props.areaOfExpertise.trim() !== "") {
      this._areaOfExpertise = props.areaOfExpertise;
    }

    if (props.professionalExperience && props.professionalExperience.trim() !== "") {
      this._professionalExperience = props.professionalExperience;
    }

    if (props.about !== undefined) {
      this._about = props.about;
    }

    if (props.website !== undefined) {
      if (props.website && !this.isValidUrl(props.website)) {
        throw new Error("Invalid website URL");
      }
      this._website = props.website;
    }

    if (props.education && props.education.trim() !== "") {
      this._education = props.education;
    }

    if (props.certifications !== undefined) {
      this._certifications = props.certifications;
    }

    if (props.cv && props.cv.trim() !== "") {
      this._cv = props.cv;
    }

    this._updatedAt = new Date();
  }

  approve(): void {
    if (this._status === "APPROVED") {
      throw new Error("Instructor is already approved");
    }
    if (this._status === "DECLINED") {
      throw new Error("Cannot approve a declined instructor");
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

  incrementStudentCount(): void {
    this._totalStudents++;
    this._updatedAt = new Date();
  }

  decrementStudentCount(): void {
    if (this._totalStudents > 0) {
      this._totalStudents--;
      this._updatedAt = new Date();
    }
  }

  softDelete(): void {
    if (this._deletedAt) {
      throw new Error("Instructor is already deleted");
    }
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }

  restore(): void {
    if (!this._deletedAt) {
      throw new Error("Instructor is not deleted");
    }
    this._deletedAt = null;
    this._updatedAt = new Date();
  }

  isDeleted(): boolean {
    return this._deletedAt !== null && this._deletedAt !== undefined;
  }

  isActive(): boolean {
    return !this.isDeleted();
  }

  isApproved(): boolean {
    return this._status === "APPROVED";
  }

  isPending(): boolean {
    return this._status === "PENDING";
  }

  isDeclined(): boolean {
    return this._status === "DECLINED";
  }

  canCreateCourses(): boolean {
    return this.isApproved() && this.isActive();
  }

  hasCompleteProfile(): boolean {
    return !!(
      this._areaOfExpertise &&
      this._professionalExperience &&
      this._education &&
      this._cv
    );
  }
}
