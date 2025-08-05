import { PrismaClient, Gender, Role } from "@prisma/client";
import { UserRecord } from "../../app/records/user.record";
import { UserProfileRecord } from "../../app/records/user-profile.record";
import { IUserRepository } from "../../app/repositories/user.repository";

export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    includeDeleted?: boolean;
    search?: string;
    filterBy?: string;
    role?: "USER" | "INSTRUCTOR" | "ADMIN";
  }): Promise<{ items: UserRecord[]; total: number; totalPages: number }> {
    const {
      page = 1,
      limit = 10,
      sortBy,
      sortOrder = "asc",
      includeDeleted = false,
      search,
      filterBy,
      role,
    } = options;
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
      where.role = role as Role;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy: sortBy ? { [sortBy]: sortOrder } : undefined,
        skip,
        take: limit,
        include: { userProfile: true },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      items: users.map(user => this.mapToUserRecord(user)),
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<UserRecord | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { userProfile: true },
    });
    return user ? this.mapToUserRecord(user) : null;
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
        avatar: userRecord.avatar,
        role: userRecord.role as Role,
        authProvider: userRecord.authProvider as any,
        isVerified: userRecord.isVerified,
        deletedAt: userRecord.deletedAt,
        updatedAt: userRecord.updatedAt,
      },
      include: { userProfile: true },
    });
    return this.mapToUserRecord(updated);
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
        gender: profile.gender as Gender,
        updatedAt: profile.updatedAt,
      },
    });
    return this.mapToUserProfileRecord(updated);
  }

  async findProfileByUserId(userId: string): Promise<UserProfileRecord | null> {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });
    return profile ? this.mapToUserProfileRecord(profile) : null;
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
        gender: profile.gender as Gender,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    });
    return this.mapToUserProfileRecord(created);
  }

  async getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    verifiedUsers: number;
    instructors: number;
    students: number;
  }> {
    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      verifiedUsers,
      instructors,
      students,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.user.count({ where: { deletedAt: { not: null } } }),
      this.prisma.user.count({ where: { isVerified: true } }),
      this.prisma.user.count({ where: { role: "INSTRUCTOR" } }),
      this.prisma.user.count({ where: { role: "USER" } }),
    ]);

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      verifiedUsers,
      instructors,
      students,
    };
  }

  async findByRole(role: "USER" | "INSTRUCTOR" | "ADMIN"): Promise<UserRecord[]> {
    const users = await this.prisma.user.findMany({
      where: { role: role as Role },
      include: { userProfile: true },
    });
    return users.map(user => this.mapToUserRecord(user));
  }

  private mapToUserRecord(prismaUser: any): UserRecord {
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

  private mapToUserProfileRecord(prismaProfile: any): UserProfileRecord {
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
