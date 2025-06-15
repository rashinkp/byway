import { PrismaClient, Gender } from "@prisma/client";
import { User } from "../../domain/entities/user.entity";
import { UserProfile } from "../../domain/entities/user-profile.entity";
import { GetAllUsersDto } from "../../domain/dtos/user/user.dto";
import {
  IPaginatedResponse,
  IUserRepository,
} from "../../app/repositories/user.repository";
import { IUserStats, IGetUserStatsInput } from "../../app/usecases/user/interfaces/get-user-stats.usecase.interface";
import { ITopInstructor, IGetTopInstructorsInput } from "../../app/usecases/user/interfaces/get-top-instructors.usecase.interface";

export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(dto: GetAllUsersDto): Promise<IPaginatedResponse<User>> {
    const {
      page,
      limit,
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

  async getUserStats(input: IGetUserStatsInput): Promise<IUserStats> {
    const [totalUsers, activeUsers, inactiveUsers, totalInstructors, activeInstructors, inactiveInstructors] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.user.count({ where: { deletedAt: { not: null } } }),
      this.prisma.user.count({ where: { role: 'INSTRUCTOR' } }),
      this.prisma.user.count({ where: { role: 'INSTRUCTOR', deletedAt: null } }),
      this.prisma.user.count({ where: { role: 'INSTRUCTOR', deletedAt: { not: null } } }),
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

  async getTopInstructors(input: IGetTopInstructorsInput): Promise<ITopInstructor[]> {
    const instructors = await this.prisma.user.findMany({
      where: { 
        role: 'INSTRUCTOR',
        deletedAt: null 
      },
      take: input.limit || 5,
    });

    return instructors.map(instructor => ({
      instructorId: instructor.id,
      instructorName: instructor.name,
      email: instructor.email,
      courseCount: 0, // Default value since courses relation might not exist
      totalEnrollments: 0, // Default value since enrollments relation might not exist
      totalRevenue: 0, // Default value since revenue calculation might need more complex logic
      averageRating: 0, // Default value since rating system might not be implemented
      isActive: instructor.deletedAt === null,
    }));
  }
}
