import { AuthProvider } from "../enum/auth-provider.enum";
import { Role } from "../enum/role.enum";
import { Email } from "../value-object/email";

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

  // Create method with explicit parameters
  static create(params: {
    name: string;
    email: string;
    password?: string;
    googleId?: string;
    facebookId?: string;
    role?: Role;
    authProvider?: AuthProvider;
    avatar?: string;
  }): User {
    const {
      name,
      email,
      password,
      googleId,
      facebookId,
      role,
      authProvider,
      avatar,
    } = params;

    if (!name || name.trim() === "") {
      throw new Error("Name is required");
    }

    const emailVO = new Email(email);

    if (!password && !googleId && !facebookId) {
      throw new Error("At least one authentication method is required");
    }

    const effectiveAuthProvider = authProvider || AuthProvider.EMAIL_PASSWORD;

    if (effectiveAuthProvider === AuthProvider.EMAIL_PASSWORD && !password) {
      throw new Error("Password is required for EMAIL_PASSWORD provider");
    }
    if (effectiveAuthProvider === AuthProvider.GOOGLE && !googleId) {
      throw new Error("Google ID is required for GOOGLE provider");
    }
    if (effectiveAuthProvider === AuthProvider.FACEBOOK && !facebookId) {
      throw new Error("Facebook ID is required for FACEBOOK provider");
    }

    return new User({
      id: crypto.randomUUID(),
      name,
      email: emailVO,
      password,
      googleId,
      facebookId,
      role: role || Role.USER,
      authProvider: effectiveAuthProvider,
      isVerified: false,
      avatar,
      deletedAt: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Update method without id parameter: relies on existingUser identity
  static update(
    existingUser: User,
    updates: {
      name?: string;
      email?: string;
      password?: string;
      googleId?: string | null;
      facebookId?: string | null;
      role?: Role;
      authProvider?: AuthProvider;
      avatar?: string | null;
      isVerified?: boolean;
      deletedAt?: Date | null;
    }
  ): User {
    const updatedProps: UserInterface = {
      ...existingUser.getProps(),
      updatedAt: new Date(),
    };

    if (updates.name && updates.name.trim() !== "") {
      updatedProps.name = updates.name;
    }

    if (updates.email) {
      updatedProps.email = new Email(updates.email);
    }

    if (updates.password) {
      updatedProps.password = updates.password; // Hashing should be handled externally
    }

    if (updates.googleId !== undefined) {
      updatedProps.googleId = updates.googleId || undefined;
      if (
        updates.googleId &&
        updatedProps.authProvider !== AuthProvider.GOOGLE
      ) {
        updatedProps.authProvider = AuthProvider.GOOGLE;
      }
    }

    if (updates.facebookId !== undefined) {
      updatedProps.facebookId = updates.facebookId || undefined;
      if (
        updates.facebookId &&
        updatedProps.authProvider !== AuthProvider.FACEBOOK
      ) {
        updatedProps.authProvider = AuthProvider.FACEBOOK;
      }
    }

    if (updates.role !== undefined) {
      updatedProps.role = updates.role;
    }

    if (updates.authProvider !== undefined) {
      updatedProps.authProvider = updates.authProvider;
    }

    if (updates.avatar !== undefined) {
      updatedProps.avatar = updates.avatar || undefined;
    }

    if (updates.isVerified !== undefined) {
      updatedProps.isVerified = updates.isVerified;
    }

    if (updates.deletedAt !== undefined) {
      updatedProps.deletedAt = updates.deletedAt || undefined;
    }

    return new User(updatedProps);
  }

  // Method to restore a soft-deleted user
  restore(): void {
    if (!this._deletedAt) {
      throw new Error("User is not deleted");
    }
    this._deletedAt = undefined;
    this._updatedAt = new Date();
  }

  // Method to soft delete a user
  softDelete(): void {
    if (this._deletedAt) {
      throw new Error("User is already deleted");
    }
    this._deletedAt = new Date();
    this._updatedAt = new Date();
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
    this._password = newPassword;
    this._updatedAt = new Date();
  }

  // Create a domain User from persisted values (DB/DTO), keeping domain concerns here
  static fromPersistence(props: {
    id: string;
    name: string;
    email: string | Email;
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
  }): User {
    const emailVO = props.email instanceof Email ? props.email : new Email(props.email);
    return new User({
      id: props.id,
      name: props.name,
      email: emailVO,
      password: props.password,
      googleId: props.googleId,
      facebookId: props.facebookId,
      role: props.role,
      authProvider: props.authProvider,
      isVerified: props.isVerified,
      avatar: props.avatar,
      deletedAt: props.deletedAt,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
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

  // Internal helper to get all props
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
