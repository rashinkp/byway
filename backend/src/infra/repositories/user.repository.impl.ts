import { PrismaClient, Gender, Role } from "@prisma/client";
import { UserRecord } from "../../app/records/user.record";
import { UserProfileRecord } from "../../app/records/user-profile.record";
import { GetAllUsersRequestDto } from "../../app/dtos/user.dto";
import {
  IPaginatedResponse,
  IUserRepository,
} from "../../app/repositories/user.repository";
import { IUserStats } from "../../app/usecases/user/interfaces/get-user-stats.usecase.interface";

export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(dto: GetAllUsersRequestDto): Promise<IPaginatedResponse<UserRecord>> {
    const {
      page = 1,
      limit = 10,
      sortBy,
      sortOrder,
      includeDeleted,
      search,
      filterBy,
      role,
    } = dto;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (!includeDeleted && filterBy !== "Inactive") {
      where.deletedAt = null;
    }
    if (filterBy === "Inactive") {
      where.deletedAt = { not: null };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }
    if (role) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy: sortBy ? { [sortBy]: sortOrder || "asc" } : undefined,
        skip,
        take: limit,
        include: { userProfile: true },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      items: users.map((u) => this.mapPrismaToUserRecord(u)),
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<UserRecord | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { userProfile: true },
    });
    if (!user) return null;
    return this.mapPrismaToUserRecord(user);
  }

  async updateUser(userRecord: UserRecord): Promise<UserRecord> {
    const updated = await this.prisma.user.update({
      where: { id: userRecord.id },
      data: {
        name: userRecord.name,
        email: userRecord.email,
        password: userRecord.password,
        googleId: userRecord.googleId,
        facebookId: userRecord.facebookId,
        role: userRecord.role,
        authProvider: userRecord.authProvider,
        isVerified: userRecord.isVerified,
        avatar: userRecord.avatar,
        deletedAt: userRecord.deletedAt,
        updatedAt: userRecord.updatedAt,
      },
      include: { userProfile: true },
    });
    return this.mapPrismaToUserRecord(updated);
  }

  async updateProfile(profile: UserProfileRecord): Promise<UserProfileRecord> {
    const updated = await this.prisma.userProfile.update({
      where: { id: profile.id },
      data: {
        bio: profile.bio,
        education: profile.education,
        skills: profile.skills,
        phoneNumber: profile.phoneNumber,
        country: profile.country,
        city: profile.city,
        address: profile.address,
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
        updatedAt: profile.updatedAt,
      },
    });
    return this.mapPrismaToUserProfileRecord(updated);
  }

  async findProfileByUserId(userId: string): Promise<UserProfileRecord | null> {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });
    if (!profile) return null;
    return this.mapPrismaToUserProfileRecord(profile);
  }

  async createProfile(profile: UserProfileRecord): Promise<UserProfileRecord> {
    const created = await this.prisma.userProfile.create({
      data: {
        id: profile.id,
        userId: profile.userId,
        bio: profile.bio,
        education: profile.education,
        skills: profile.skills,
        phoneNumber: profile.phoneNumber,
        country: profile.country,
        city: profile.city,
        address: profile.address,
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    });
    return this.mapPrismaToUserProfileRecord(created);
  }

  async getUserStats(): Promise<IUserStats> {
    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      totalInstructors,
      activeInstructors,
      inactiveInstructors,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.user.count({ where: { deletedAt: { not: null } } }),
      this.prisma.user.count({ where: { role: "INSTRUCTOR" } }),
      this.prisma.user.count({
        where: { role: "INSTRUCTOR", deletedAt: null },
      }),
      this.prisma.user.count({
        where: { role: "INSTRUCTOR", deletedAt: { not: null } },
      }),
    ]);

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      totalInstructors,
      activeInstructors,
      inactiveInstructors,
    };
  }

  async findByRole(role: Role): Promise<UserRecord[]> {
    const users = await this.prisma.user.findMany({
      where: { role },
    });
    return users.map((u) => this.mapPrismaToUserRecord(u));
  }

  private mapPrismaToUserRecord(prismaUser: any): UserRecord {
    return {
      id: prismaUser.id,
      name: prismaUser.name,
      email: prismaUser.email,
      password: prismaUser.password,
      googleId: prismaUser.googleId,
      facebookId: prismaUser.facebookId,
      avatar: prismaUser.avatar,
      role: prismaUser.role,
      authProvider: prismaUser.authProvider,
      isVerified: prismaUser.isVerified,
      deletedAt: prismaUser.deletedAt,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    };
  }

  private mapPrismaToUserProfileRecord(prismaProfile: any): UserProfileRecord {
    return {
      id: prismaProfile.id,
      userId: prismaProfile.userId,
      bio: prismaProfile.bio,
      education: prismaProfile.education,
      skills: prismaProfile.skills,
      phoneNumber: prismaProfile.phoneNumber,
      country: prismaProfile.country,
      city: prismaProfile.city,
      address: prismaProfile.address,
      dateOfBirth: prismaProfile.dateOfBirth,
      gender: prismaProfile.gender,
      createdAt: prismaProfile.createdAt,
      updatedAt: prismaProfile.updatedAt,
    };
  }
}
