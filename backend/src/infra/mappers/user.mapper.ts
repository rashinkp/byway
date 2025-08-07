import { User as PrismaUser } from "@prisma/client";
import { User } from "@/domain/entities/user.entity";

export class UserMapper {
  static toDomain(prismaUser: PrismaUser): User {
    return User.fromPrisma(prismaUser);
  }

  static toPersistence(user: User): PrismaUser {
    return user.toPersistence() as PrismaUser;
  }
}
