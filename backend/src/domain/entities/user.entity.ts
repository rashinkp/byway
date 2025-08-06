import { Email } from "../value-object/email";
import { AuthProvider } from "../enum/auth-provider.enum";
import { Role } from "../enum/role.enum";
import { CreateUserParams, UpdateUserParams, UserProps } from "../interfaces/user";


export class User {
  private readonly _id: string;
  private _name: string;
  private readonly _email: Email;
  private _password?: string;
  private _googleId?: string;
  private _facebookId?: string;
  private _role: Role;
  private _authProvider: AuthProvider;
  private _isVerified: boolean;
  private _avatar?: string;
  private _deletedAt?: Date;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: UserProps) {
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

  // Factory method to create a new User
  static create(params: CreateUserParams): User {
    const email = new Email(params.email);
    User.validateCreationParams(params);

    return new User({
      id: crypto.randomUUID(),
      name: params.name,
      email,
      password: params.password,
      googleId: params.googleId,
      facebookId: params.facebookId,
      role: params.role || Role.USER,
      authProvider: params.authProvider || AuthProvider.EMAIL_PASSWORD,
      isVerified: false,
      avatar: params.avatar,
      deletedAt: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Factory method to update an existing User
  static update(user: User, params: UpdateUserParams): User {
    const updatedProps: UserProps = {
      ...user.getProps(),
      updatedAt: new Date(),
    };

    if (params.name && params.name.trim() !== "") {
      updatedProps.name = params.name;
    }

    if (params.email) {
      updatedProps.email = new Email(params.email);
    }

    if (params.password) {
      updatedProps.password = params.password;
    }

    if (params.googleId !== undefined) {
      updatedProps.googleId = params.googleId;
      if (
        params.googleId &&
        updatedProps.authProvider !== AuthProvider.GOOGLE
      ) {
        updatedProps.authProvider = AuthProvider.GOOGLE;
      }
    }

    if (params.facebookId !== undefined) {
      updatedProps.facebookId = params.facebookId;
      if (
        params.facebookId &&
        updatedProps.authProvider !== AuthProvider.FACEBOOK
      ) {
        updatedProps.authProvider = AuthProvider.FACEBOOK;
      }
    }

    if (params.avatar !== undefined) {
      updatedProps.avatar = params.avatar;
    }

    if (params.isVerified !== undefined) {
      updatedProps.isVerified = params.isVerified;
    }

    if (params.deletedAt !== undefined) {
      updatedProps.deletedAt = params.deletedAt;
    }

    if (params.role !== undefined) {
      updatedProps.role = params.role;
    }

    return new User(updatedProps);
  }

  // Validation logic for creation
  private static validateCreationParams(params: CreateUserParams): void {
    if (!params.name || params.name.trim() === "") {
      throw new Error("Name is required");
    }

    if (!params.password && !params.googleId && !params.facebookId) {
      throw new Error("At least one authentication method is required");
    }

    const authProvider = params.authProvider || AuthProvider.EMAIL_PASSWORD;
    if (authProvider === AuthProvider.EMAIL_PASSWORD && !params.password) {
      throw new Error("Password is required for EMAIL_PASSWORD provider");
    }
    if (authProvider === AuthProvider.GOOGLE && !params.googleId) {
      throw new Error("Google ID is required for GOOGLE provider");
    }
    if (authProvider === AuthProvider.FACEBOOK && !params.facebookId) {
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

  // Domain methods
  verifyEmail(): User {
    if (this._isVerified) {
      throw new Error("User is already verified");
    }
    return User.update(this, { isVerified: true });
  }

  changePassword(newPassword: string): User {
    if (!newPassword || newPassword.trim() === "") {
      throw new Error("Password cannot be empty");
    }
    return User.update(this, { password: newPassword });
  }

  softDelete(): User {
    if (this._deletedAt) {
      throw new Error("User is already deleted");
    }
    return User.update(this, { deletedAt: new Date() });
  }

  restore(): User {
    if (!this._deletedAt) {
      throw new Error("User is not deleted");
    }
    return User.update(this, { deletedAt: undefined });
  }

  // Private helper to get all properties
  private getProps(): UserProps {
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
