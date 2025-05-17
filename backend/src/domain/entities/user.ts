import { AuthProvider } from "../enum/auth-provider.enum";
import { Role } from "../enum/role.enum";
import { Email } from "../value-object/email";

// Interface for User creation DTO
interface ICreateUserRequestDTO {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  facebookId?: string;
  role?: Role;
  authProvider?: AuthProvider;
  avatar?: string;
}

// Interface for User update DTO
export interface IUpdateUserRequestDTO {
  id: string;
  name?: string;
  email?: string;
  role?: Role;
  password?: string;
  googleId?: string;
  facebookId?: string;
  avatar?: string;
  isVerified?: boolean;
  deletedAt?: Date;
}

// Interface for User properties
interface UserInterface {
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
}

export class User {
  private _id: string;
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

  // Static factory method to create a new User
  static create(dto: ICreateUserRequestDTO): User {
    const email = new Email(dto.email);

    // Validate required fields
    if (!dto.name || dto.name.trim() === "") {
      throw new Error("Name is required");
    }

    // Ensure at least one authentication method is provided
    if (!dto.password && !dto.googleId && !dto.facebookId) {
      throw new Error("At least one authentication method is required");
    }

    // Ensure authProvider matches the provided credentials
    const authProvider = dto.authProvider || AuthProvider.EMAIL_PASSWORD;
    if (authProvider === AuthProvider.EMAIL_PASSWORD && !dto.password) {
      throw new Error("Password is required for EMAIL_PASSWORD provider");
    }
    if (authProvider === AuthProvider.GOOGLE && !dto.googleId) {
      throw new Error("Google ID is required for GOOGLE provider");
    }
    if (authProvider === AuthProvider.FACEBOOK && !dto.facebookId) {
      throw new Error("Facebook ID is required for FACEBOOK provider");
    }

    return new User({
      id: crypto.randomUUID(),
      name: dto.name,
      email,
      password: dto.password,
      googleId: dto.googleId,
      facebookId: dto.facebookId,
      role: dto.role || Role.USER,
      authProvider,
      isVerified: false,
      avatar: dto.avatar,
      deletedAt: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Static factory method to update an existing User
  static update(existingUser: User, dto: IUpdateUserRequestDTO): User {
    if (existingUser._id !== dto.id) {
      throw new Error("Cannot update user with mismatched ID");
    }

    const updatedProps: UserInterface = {
      ...existingUser.getProps(),
      updatedAt: new Date(),
    };

    if (dto.name && dto.name.trim() !== "") {
      updatedProps.name = dto.name;
    }

    if (dto.email) {
      updatedProps.email = new Email(dto.email);
    }

    if (dto.password) {
      updatedProps.password = dto.password; // Assume hashing is handled elsewhere
    }

    if (dto.googleId !== undefined) {
      updatedProps.googleId = dto.googleId;
      if (dto.googleId && updatedProps.authProvider !== AuthProvider.GOOGLE) {
        updatedProps.authProvider = AuthProvider.GOOGLE;
      }
    }

    if (dto.facebookId !== undefined) {
      updatedProps.facebookId = dto.facebookId;
      if (
        dto.facebookId &&
        updatedProps.authProvider !== AuthProvider.FACEBOOK
      ) {
        updatedProps.authProvider = AuthProvider.FACEBOOK;
      }
    }

    if (dto.avatar !== undefined) {
      updatedProps.avatar = dto.avatar;
    }

    if (dto.isVerified !== undefined) {
      updatedProps.isVerified = dto.isVerified;
    }

    if (dto.deletedAt !== undefined) {
      updatedProps.deletedAt = dto.deletedAt;
    }

    return new User(updatedProps);
  }

  // Static method to create User from Prisma data
  static fromPrisma(data: {
    id: string;
    name: string;
    email: string;
    password?: string | null;
    googleId?: string | null;
    facebookId?: string | null;
    role: string;
    authProvider: string;
    isVerified: boolean;
    avatar?: string | null;
    deletedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User({
      id: data.id,
      name: data.name,
      email: new Email(data.email),
      password: data.password ?? undefined,
      googleId: data.googleId ?? undefined,
      facebookId: data.facebookId ?? undefined,
      role: data.role as Role,
      authProvider: data.authProvider as AuthProvider,
      isVerified: data.isVerified,
      avatar: data.avatar ?? undefined,
      deletedAt: data.deletedAt ?? undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  // Constructor is private to force usage of factory methods
  private constructor(props: UserInterface) {
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

  // Getters
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email.address;
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

  // Method to verify email
  verifyEmail(): void {
    if (this._isVerified) {
      throw new Error("User is already verified");
    }
    this._isVerified = true;
    this._updatedAt = new Date();
  }

  // Method to change password
  changePassword(newPassword: string): void {
    if (!newPassword || newPassword.trim() === "") {
      throw new Error("Password cannot be empty");
    }
    this._password = newPassword; // Assume hashing is handled elsewhere
    this._updatedAt = new Date();
  }

  // Method to soft delete
  softDelete(): void {
    if (this._deletedAt) {
      throw new Error("User is already deleted");
    }
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }

  // Method to restore a soft-deleted user
  restore(): void {
    if (!this._deletedAt) {
      throw new Error("User is not deleted");
    }
    this._deletedAt = undefined;
    this._updatedAt = new Date();
  }

  // Helper method to get all properties (for internal use)
  private getProps(): UserInterface {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      password: this._password,
      googleId: this._googleId,
      facebookId: this._facebookId,
      role: this._role,
      authProvider: this._authProvider,
      isVerified: this._isVerified,
      avatar: this._avatar,
      deletedAt: this._deletedAt,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
