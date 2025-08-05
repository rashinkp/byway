import { User } from "../../domain/entities/user.entity";
import { UserRecord } from "../records/user.record";
import { Email } from "../../domain/value-object/email";
import { Role } from "../../domain/enum/role.enum";
import { AuthProvider } from "../../domain/enum/auth-provider.enum";

export class UserMapper {
  static toDomain(record: UserRecord): User {
    return new User({
      id: record.id,
      name: record.name,
      email: new Email(record.email),
      password: record.password || undefined,
      googleId: record.googleId || undefined,
      facebookId: record.facebookId || undefined,
      role: record.role as Role,
      authProvider: record.authProvider as AuthProvider,
      isVerified: record.isVerified,
      avatar: record.avatar || undefined,
      deletedAt: record.deletedAt || undefined,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  static toRecord(user: User): UserRecord {
    return {
      id: user.id,
      name: user.name,
      email: user.email.value,
      password: user.password || null,
      googleId: user.googleId || null,
      facebookId: user.facebookId || null,
      avatar: user.avatar || null,
      role: user.role as any,
      authProvider: user.authProvider as any,
      isVerified: user.isVerified,
      deletedAt: user.deletedAt || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
} 