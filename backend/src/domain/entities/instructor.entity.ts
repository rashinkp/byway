import { InstructorInterface } from "../interfaces/instructor";

export class Instructor {
  private readonly _id: string;
  private readonly _userId: string;
  private readonly _areaOfExpertise: string;
  private readonly _professionalExperience: string;
  private readonly _about: string | null;
  private readonly _website: string | null;
  private readonly _education: string;
  private readonly _certifications: string;
  private readonly _cv: string;
  private _status: "PENDING" | "APPROVED" | "DECLINED";
  private readonly _totalStudents: number;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date | null;

  constructor(props: InstructorInterface) {
    if (!props.userId) {
      throw new Error("User ID is required");
    }
    if (!props.areaOfExpertise || props.areaOfExpertise.trim() === "") {
      throw new Error("Area of expertise is required and cannot be empty");
    }
    if (
      !props.professionalExperience ||
      props.professionalExperience.trim() === ""
    ) {
      throw new Error(
        "Professional experience is required and cannot be empty"
      );
    }
    if (!props.education || props.education.trim() === "") {
      throw new Error("Education is required and cannot be empty");
    }
    if (!props.certifications || props.certifications.trim() === "") {
      throw new Error("Certifications are required and cannot be empty");
    }
    if (!props.cv || props.cv.trim() === "") {
      throw new Error("CV is required and cannot be empty");
    }
    if (props.totalStudents < 0) {
      throw new Error("Total students cannot be negative");
    }

    this._id = props.id;
    this._userId = props.userId;
    this._areaOfExpertise = props.areaOfExpertise.trim();
    this._professionalExperience = props.professionalExperience.trim();
    this._about = props.about ? props.about.trim() : null;
    this._website = props.website ? props.website.trim() : null;
    this._education = props.education.trim();
    this._certifications = props.certifications.trim();
    this._cv = props.cv.trim();
    this._status = props.status;
    this._totalStudents = props.totalStudents;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._deletedAt = props.deletedAt ?? null;
  }

  approve(): void {
    if (this._deletedAt) {
      throw new Error("Cannot approve a deleted instructor");
    }
    if (this._status === "APPROVED") {
      throw new Error("Instructor is already approved");
    }
    this._status = "APPROVED";
    this._updatedAt = new Date();
  }

  decline(): void {
    if (this._deletedAt) {
      throw new Error("Cannot decline a deleted instructor");
    }
    if (this._status === "DECLINED") {
      throw new Error("Instructor is already declined");
    }
    this._status = "DECLINED";
    this._updatedAt = new Date();
  }

  softDelete(): void {
    if (this._deletedAt) {
      throw new Error("Instructor is already deleted");
    }
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }

  recover(): void {
    if (!this._deletedAt) {
      throw new Error("Instructor is not deleted");
    }
    this._deletedAt = null;
    this._updatedAt = new Date();
  }

  isActive(): boolean {
    return !this._deletedAt && this._status === "APPROVED";
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

  get about(): string | null {
    return this._about;
  }

  get website(): string | null {
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

  get deletedAt(): Date | null {
    return this._deletedAt;
  }
}
