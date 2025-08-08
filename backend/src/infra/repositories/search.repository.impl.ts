import { PrismaClient } from "@prisma/client";
import { ISearchRepository } from "../../app/repositories/search.repository";
import { ISearchResult, SearchParams } from "../../app/dtos/search.dto";

export class SearchRepository implements ISearchRepository {
  constructor(private prisma: PrismaClient) {}

  async search(
    params: SearchParams & { userId?: string }
  ): Promise<ISearchResult> {
    const { query, page = 1, limit = 10, userId } = params;
    const skip = (page - 1) * limit;
    console.log(
      "[SearchRepository] Received limit:",
      limit,
      "skip:",
      skip,
      "page:",
      page
    );

    const [instructors, courses, categories, certificates] = await Promise.all([
      this.searchInstructors(query, skip, limit),
      this.searchCourses(query, skip, limit),
      this.searchCategories(query, skip, limit),
      this.searchCertificates(query, skip, limit, userId),
    ]);

    return {
      instructors,
      courses,
      categories,
      certificates,
    };
  }

  private async searchInstructors(query: string, skip: number, limit: number) {
    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          AND: [
            {
              role: "INSTRUCTOR",
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                {
                  instructorDetails: {
                    about: { contains: query, mode: "insensitive" },
                  },
                },
              ],
            },
            {
              deletedAt: null,
            },
          ],
        },
        select: {
          id: true,
          name: true,
          avatar: true,
          instructorDetails: {
            select: {
              about: true,
            },
          },
        },
        skip,
        take: limit,
      }),
      this.prisma.user.count({
        where: {
          AND: [
            {
              role: "INSTRUCTOR",
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                {
                  instructorDetails: {
                    about: { contains: query, mode: "insensitive" },
                  },
                },
              ],
            },
            {
              deletedAt: null,
            },
          ],
        },
      }),
    ]);

    return {
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        avatar: item.avatar,
        shortBio: item.instructorDetails?.about?.substring(0, 100) || "",
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
          AND: [
            {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
              ],
            },
            {
              deletedAt: null,
              approvalStatus: "APPROVED",
              status: "PUBLISHED",
            },
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
          AND: [
            {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
              ],
            },
            {
              deletedAt: null,
              approvalStatus: "APPROVED",
              status: "PUBLISHED",
            },
          ],
        },
      }),
    ]);

    return {
      items: items.map((item) => ({
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
          AND: [
            {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
              ],
            },
            {
              deletedAt: null,
            },
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
          AND: [
            {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
              ],
            },
            {
              deletedAt: null,
            },
          ],
        },
      }),
    ]);

    return {
      items: items.map((item) => ({
        id: item.id,
        title: item.name,
        description: item.description || "",
      })),
      total,
      page: Math.floor(skip / limit) + 1,
      limit,
    };
  }

  private async searchCertificates(
    query: string,
    skip: number,
    limit: number,
    userId?: string
  ) {
    if (!userId) {
      return {
        items: [],
        total: 0,
        page: 1,
        limit,
      };
    }
    const where: any = {
      userId,
      OR: [
        { certificateNumber: { contains: query, mode: "insensitive" } },
        { course: { title: { contains: query, mode: "insensitive" } } },
        { user: { name: { contains: query, mode: "insensitive" } } },
      ],
    };
    // Debug log
    const [items, total] = await Promise.all([
      this.prisma.certificate.findMany({
        where,
        include: {
          course: { select: { title: true } },
          user: { select: { name: true } },
        },
        skip,
        take: limit,
      }),
      this.prisma.certificate.count({ where }),
    ]);

    return {
      items: items.map((item) => ({
        id: item.id,
        certificateNumber: item.certificateNumber,
        courseTitle: item.course?.title || "",
        userName: item.user?.name || "",
        issuedAt: item.issuedAt ? item.issuedAt.toISOString() : null,
        pdfUrl: item.pdfUrl || "",
      })),
      total,
      page: Math.floor(skip / limit) + 1,
      limit,
    };
  }
}
