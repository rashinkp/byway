import { PrismaClient } from "@prisma/client";
import { ISearchRepository } from "../../app/repositories/search.repository";
import { ISearchResult, SearchParams } from "../../domain/dtos/search/search.dto";

export class SearchRepository implements ISearchRepository {
  constructor(private prisma: PrismaClient) {}

  async search(params: SearchParams): Promise<ISearchResult> {
    const { query, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const [instructors, courses, categories] = await Promise.all([
      this.searchInstructors(query, skip, limit),
      this.searchCourses(query, skip, limit),
      this.searchCategories(query, skip, limit),
    ]);

    return {
      instructors,
      courses,
      categories,
    };
  }

  private async searchInstructors(query: string, skip: number, limit: number) {
    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          role: "INSTRUCTOR",
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { instructorDetails: { about: { contains: query, mode: 'insensitive' } } },
          ],
        },
        select: {
          id: true,
          name: true,
          avatar: true,
          instructorDetails: {
            select: {
              about: true,
            }
          }
        },
        skip,
        take: limit,
      }),
      this.prisma.user.count({
        where: {
          role: "INSTRUCTOR",
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { instructorDetails: { about: { contains: query, mode: 'insensitive' } } },
          ],
        },
      }),
    ]);

    return {
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        avatar: item.avatar,
        shortBio: item.instructorDetails?.about?.substring(0, 100) || '',
      })),
      total,
      page: Math.floor(skip / limit) + 1,
      limit,
    };
  }

  private async searchCourses(query: string, skip: number, limit: number) {
    const [items, total] = await Promise.all([
      this.prisma.course.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          title: true,
          thumbnail: true,
          price: true,
          offer: true,
        },
        skip,
        take: limit,
      }),
      this.prisma.course.count({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
      }),
    ]);

    return {
      items: items.map(item => ({
        id: item.id,
        title: item.title,
        thumbnail: item.thumbnail,
        price: Number(item.price) || 0,
        offer: Number(item.offer) || 0,
      })),
      total,
      page: Math.floor(skip / limit) + 1,
      limit,
    };
  }

  private async searchCategories(query: string, skip: number, limit: number) {
    const [items, total] = await Promise.all([
      this.prisma.category.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          name: true,
          description: true,
        },
        skip,
        take: limit,
      }),
      this.prisma.category.count({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
      }),
    ]);

    return {
      items: items.map(item => ({
        id: item.id,
        title: item.name,
        description: item.description || '',
      })),
      total,
      page: Math.floor(skip / limit) + 1,
      limit,
    };
  }
} 