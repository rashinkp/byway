import { PrismaClient, Gender, Role as PrismaRole } from "@prisma/client";
import { User } from "../../domain/entities/user.entity";
import { UserProfile } from "../../domain/entities/user-profile.entity";
import {
  IUserRepository,
} from "../../app/repositories/user.repository";
import { PaginatedResult, PaginationFilter } from "../../domain/types/pagination-filter.interface";
import { UserStats } from "../../domain/types/user.interface";
import { Role as DomainRole } from "../../domain/enum/role.enum";

export class UserRepository implements IUserRepository {
  constructor(private _prisma: PrismaClient) {}

  async findAll(input: PaginationFilter): Promise<PaginatedResult<User>> {
    const {
      page = 1,
      limit = 10,
      sortBy,
      sortOrder,
      includeDeleted,
      search,
      filterBy,
      role,
    } = input;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
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
      this._prisma.user.findMany({
        where,
        orderBy: sortBy ? { [sortBy]: sortOrder || "asc" } : undefined,
        skip,
        take: limit,
        include: { userProfile: true },
      }),
      this._prisma.user.count({ where }),
    ]);

    return {
      items: users.map((u) =>
        User.fromPersistence({
          id: u.id,
          name: u.name,
          email: u.email,
          password: u.password ?? undefined,
          googleId: u.googleId ?? undefined,
          facebookId: u.facebookId ?? undefined,
          role: u.role as DomainRole,
          authProvider: u.authProvider as any,
          isVerified: u.isVerified,
          avatar: u.avatar ?? undefined,
          deletedAt: u.deletedAt ?? undefined,
          createdAt: u.createdAt,
          updatedAt: u.updatedAt,
        })
      ),
      total,
      totalPage: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<User | null> {
    const user = await this._prisma.user.findUnique({
      where: { id },
      include: { userProfile: true },
    });
    if (!user) return null;
    return User.fromPersistence({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password ?? undefined,
      googleId: user.googleId ?? undefined,
      facebookId: user.facebookId ?? undefined,
      role: user.role as DomainRole,
      authProvider: user.authProvider as any,
      isVerified: user.isVerified,
      avatar: user.avatar ?? undefined,
      deletedAt: user.deletedAt ?? undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async updateUser(user: User): Promise<User> {
    const updated = await this._prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        email: user.email,
        password: user.password ?? null,
        googleId: user.googleId ?? null,
        facebookId: user.facebookId ?? null,
        role: user.role as any,
        authProvider: user.authProvider as any,
        isVerified: user.isVerified,
        avatar: user.avatar ?? null,
        deletedAt: user.deletedAt ?? null,
        updatedAt: user.updatedAt,
      },
      include: { userProfile: true },
    });
    return User.fromPersistence({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      password: updated.password ?? undefined,
      googleId: updated.googleId ?? undefined,
      facebookId: updated.facebookId ?? undefined,
      role: updated.role as DomainRole,
      authProvider: updated.authProvider as any,
      isVerified: updated.isVerified,
      avatar: updated.avatar ?? undefined,
      deletedAt: updated.deletedAt ?? undefined,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }

  async updateProfile(profile: UserProfile): Promise<UserProfile> {
    const updated = await this._prisma.userProfile.update({
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
    return UserProfile.fromPersistence(updated);
  }

  async findProfileByUserId(userId: string): Promise<UserProfile | null> {
    const profile = await this._prisma.userProfile.findUnique({
      where: { userId },
    });
    if (!profile) return null;
    return UserProfile.fromPersistence(profile);
  }

  async createProfile(profile: UserProfile): Promise<UserProfile> {
    const created = await this._prisma.userProfile.create({
      data: {
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
    return UserProfile.fromPersistence(created);
  }

  async getUserStats(): Promise<UserStats> {
    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      totalInstructors,
      activeInstructors,
      inactiveInstructors,
    ] = await Promise.all([
      this._prisma.user.count(),
      this._prisma.user.count({ where: { deletedAt: null } }),
      this._prisma.user.count({ where: { deletedAt: { not: null } } }),
      this._prisma.user.count({ where: { role: "INSTRUCTOR" } }),
      this._prisma.user.count({
        where: { role: "INSTRUCTOR", deletedAt: null },
      }),
      this._prisma.user.count({
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

  async findByRole(role: DomainRole): Promise<User[]> {
    const users = await this._prisma.user.findMany({
      where: { role: role as unknown as PrismaRole },
    });
    return users.map((u) =>
      User.fromPersistence({
        id: u.id,
        name: u.name,
        email: u.email,
        password: u.password ?? undefined,
        googleId: u.googleId ?? undefined,
        facebookId: u.facebookId ?? undefined,
        role: u.role as DomainRole,
        authProvider: u.authProvider as any,
        isVerified: u.isVerified,
        avatar: u.avatar ?? undefined,
        deletedAt: u.deletedAt ?? undefined,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      })
    );
  }
}
