import { PrismaClient, Gender, Role } from "@prisma/client";
import { User } from "../../domain/entities/user.entity";
import { UserProfile } from "../../domain/entities/user-profile.entity";
import { GetAllUsersDto } from "../../app/dtos/user.dto";
import {
  IPaginatedResponse,
  IUserRepository,
} from "../../app/repositories/user.repository";
import { IUserStats } from "../../app/usecases/user/interfaces/get-user-stats.usecase.interface";

export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(dto: GetAllUsersDto): Promise<IPaginatedResponse<User>> {
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
      items: users.map((u) => {
        const user = User.fromPrisma(u);
        return user;
      }),
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { userProfile: true },
    });
    if (!user) return null;
    return User.fromPrisma(user);
  }

  async updateUser(user: User): Promise<User> {
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        googleId: user.googleId,
        facebookId: user.facebookId,
        role: user.role,
        authProvider: user.authProvider,
        isVerified: user.isVerified,
        avatar: user.avatar,
        deletedAt: user.deletedAt ? user.deletedAt : null,
        updatedAt: user.updatedAt,
      },
      include: { userProfile: true },
    });
    return User.fromPrisma(updated);
  }

  async updateProfile(profile: UserProfile): Promise<UserProfile> {
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
        gender: profile.gender as Gender | null,
        updatedAt: profile.updatedAt,
      },
    });
    return UserProfile.fromPrisma(updated);
  }

  async findProfileByUserId(userId: string): Promise<UserProfile | null> {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });
    if (!profile) return null;
    return UserProfile.fromPrisma(profile);
  }

  async createProfile(profile: UserProfile): Promise<UserProfile> {
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
        gender: profile.gender as Gender | null,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    });
    return UserProfile.fromPrisma(created);
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

  async findByRole(role: Role): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { role },
    });
    return users.map((u) => User.fromPrisma(u));
  }
}
