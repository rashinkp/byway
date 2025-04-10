import {
  PrismaClient,
  User as PrismaUser,
  UserProfile as PrismaUserProfile,
  Role,
} from "@prisma/client";
import {
  IUser,
  UpdateUserInput,
  IUserWithProfile,
  IUserProfile,
  IGetAllUsersInput,
  AdminUpdateUserInput,
} from "./types";



interface IGetAllUsersWithSkip extends IGetAllUsersInput {
  skip: number;
  role?:Role
}



export interface IUserRepository {
  updateUser(input: UpdateUserInput): Promise<IUserWithProfile>;
  getAllUsers(
    input: IGetAllUsersWithSkip
  ): Promise<{ users: IUser[]; total: number }>;
}



export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async updateUser(input: UpdateUserInput): Promise<IUserWithProfile> {
    const { userId, user, profile } = input;

    return this.prisma.$transaction(async (tx) => {
      let updatedUser: PrismaUser;
      if (user && Object.keys(user).length > 0) {
        updatedUser = await tx.user.update({
          where: { id: userId },
          data: {
            name: user.name || undefined,
            password: user.password || undefined,
            avatar: user.avatar || undefined,
            updatedAt: new Date(),
          },
        });
      } else {
        updatedUser = await tx.user.findUniqueOrThrow({
          where: { id: userId },
        });
      }

      let updatedProfile: PrismaUserProfile | null;
      if (profile && Object.keys(profile).length > 0) {
        updatedProfile = await tx.userProfile.upsert({
          where: { userId },
          update: {
            ...profile,
            updatedAt: new Date(),
          },
          create: {
            ...profile,
            userId,
          },
        });
      } else {
        updatedProfile = await tx.userProfile.findUnique({ where: { userId } });
      }

      return {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          role: updatedUser.role,
          name: updatedUser.name || undefined,
          password: updatedUser.password || undefined,
          avatar: updatedUser.avatar || undefined,
        },
        profile: updatedProfile
          ? {
              id: updatedProfile.id,
              userId: updatedProfile.userId,
              bio: updatedProfile.bio || undefined,
              education: updatedProfile.education || undefined,
              skills: updatedProfile.skills || undefined,
              phoneNumber: updatedProfile.phoneNumber || undefined,
              country: updatedProfile.country || undefined,
              city: updatedProfile.city || undefined,
              address: updatedProfile.address || undefined,
              dateOfBirth: updatedProfile.dateOfBirth || undefined,
              gender: updatedProfile.gender || undefined,
            }
          : undefined,
      };
    });
  }

  //get all users

  async getAllUsers(
    input: IGetAllUsersWithSkip
  ): Promise<{ users: IUser[]; total: number }> {
    const { page = 1, limit = 10, skip, role } = input;

    const where = role ? { role } : { role: Role.USER };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { users, total };
  }

  async updateUserByAdmin(input: AdminUpdateUserInput): Promise<void> {
    const { userId, deletedAt } = input;

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          deletedAt: deletedAt === undefined ? undefined : deletedAt,
          updatedAt:new Date(),
        }
      })
    
  }
}
