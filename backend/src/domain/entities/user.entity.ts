import { AuthProvider } from "../enum/auth-provider.enum";
import { Role } from "../enum/role.enum";
import { Email } from "../value-object/email";

export class User {
  private readonly _id: string;
  private _name: string;
  private _email: Email;
  private _password?: string;
  private _googleId?: string;
  private _facebookId?: string;
  private _role: Role;
  private _authProvider: AuthProvider;
  private _isVerified: boolean;
  private _avatar?: string;
  private _deletedAt?: Date;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: {
    id: string;
    name: string;
    email: Email;
    password?: string;
    googleId?: string;
    facebookId?: string;
    role: Role;
    authProvider: AuthProvider;
    isVerified: boolean;
    avatar?: string;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.validateUser(props);
    
    this._id = props.id;
    this._name = props.name;
    this._email = props.email;
    this._password = props.password;
    this._googleId = props.googleId;
    this._facebookId = props.facebookId;
    this._role = props.role;
    this._authProvider = props.authProvider;
    this._isVerified = props.isVerified;
    this._avatar = props.avatar;
    this._deletedAt = props.deletedAt;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  // Domain validation rules
  private validateUser(props: any): void {
    if (!props.name || props.name.trim() === "") {
      throw new Error("Name is required");
    }

    if (!props.email) {
      throw new Error("Email is required");
    }

    // Ensure at least one authentication method is provided
    if (!props.password && !props.googleId && !props.facebookId) {
      throw new Error("At least one authentication method is required");
    }

    // Ensure authProvider matches the provided credentials
    if (props.authProvider === AuthProvider.EMAIL_PASSWORD && !props.password) {
      throw new Error("Password is required for EMAIL_PASSWORD provider");
    }
    if (props.authProvider === AuthProvider.GOOGLE && !props.googleId) {
      throw new Error("Google ID is required for GOOGLE provider");
    }
    if (props.authProvider === AuthProvider.FACEBOOK && !props.facebookId) {
      throw new Error("Facebook ID is required for FACEBOOK provider");
    }
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): Email {
    return this._email;
  }

  get password(): string | undefined {
    return this._password;
  }

  get googleId(): string | undefined {
    return this._googleId;
  }

  get facebookId(): string | undefined {
    return this._facebookId;
  }

  get role(): Role {
    return this._role;
  }

  get authProvider(): AuthProvider {
    return this._authProvider;
  }

  get isVerified(): boolean {
    return this._isVerified;
  }

  get avatar(): string | undefined {
    return this._avatar;
  }

  get deletedAt(): Date | undefined {
    return this._deletedAt;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business logic methods
  verifyEmail(): void {
    if (this._isVerified) {
      throw new Error("User is already verified");
    }
    this._isVerified = true;
    this._updatedAt = new Date();
  }

  changePassword(newPassword: string): void {
    if (!newPassword || newPassword.trim() === "") {
      throw new Error("Password cannot be empty");
    }
    this._password = newPassword;
    this._updatedAt = new Date();
  }

  updateProfile(updates: {
    name?: string;
    avatar?: string;
  }): void {
    if (updates.name && updates.name.trim() !== "") {
      this._name = updates.name;
    }
    
    if (updates.avatar !== undefined) {
      this._avatar = updates.avatar;
    }
    
    this._updatedAt = new Date();
  }

  changeRole(newRole: Role): void {
    this._role = newRole;
    this._updatedAt = new Date();
  }

  softDelete(): void {
    if (this._deletedAt) {
      throw new Error("User is already deleted");
    }
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }

  restore(): void {
    if (!this._deletedAt) {
      throw new Error("User is not deleted");
    }
    this._deletedAt = undefined;
    this._updatedAt = new Date();
  }

  isDeleted(): boolean {
    return this._deletedAt !== undefined;
  }

  canAccessInstructorFeatures(): boolean {
    return this._role === Role.INSTRUCTOR || this._role === Role.ADMIN;
  }

  canAccessAdminFeatures(): boolean {
    return this._role === Role.ADMIN;
  }

  hasValidAuthentication(): boolean {
    return this._isVerified && !this.isDeleted();
  }
}
