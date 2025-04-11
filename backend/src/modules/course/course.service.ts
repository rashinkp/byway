import { CourseRepository } from "./course.repository";
import { CategoryRepository } from "../category/category.repository";
import {
  ICourse,
  ICreateCourseInput,
  IUpdateCourseInput,
  IGetAllCoursesInput,
} from "./types";

export class CourseService {
  constructor(
    private courseRepository: CourseRepository,
    private categoryRepository: CategoryRepository
  ) {}

  async createCourse(input: ICreateCourseInput): Promise<ICourse> {
    const { categoryId, title, createdBy } = input;

    //todo change this to calling category service not directly the repo category
    const category = await this.categoryRepository.getCategoryById(categoryId);
    if (!category || category.deletedAt) {
      throw new Error("Category not found or deleted");
    }

    const existingCourse = await this.courseRepository.getCourseByName(title);
    if (existingCourse) {
      throw new Error("A course with this title already exists");
    }

    return this.courseRepository.createCourse(input);
  }

  async getAllCourses(
    input: IGetAllCoursesInput
  ): Promise<{ courses: ICourse[]; total: number }> {
    return this.courseRepository.getAllCourses(input);
  }

  async getCourseById(id: string): Promise<ICourse | null> {
    return this.courseRepository.getCourseById(id);
  }

  async updateCourse(input: IUpdateCourseInput): Promise<ICourse> {
    const { id, categoryId, title, createdBy } = input;

    const course = await this.courseRepository.getCourseById(id);
    if (!course || course.deletedAt) {
      throw new Error("Course not found or deleted");
    }
    if (course.createdBy !== createdBy) {
      throw new Error("Unauthorized: You can only update your own courses");
    }

    if (categoryId) {
      const category = await this.categoryRepository.getCategoryById(
        categoryId
      );
      if (!category || category.deletedAt) {
        throw new Error("Category not found or deleted");
      }
    }

    if (title && title !== course.title) {
      const existingCourse = await this.courseRepository.getCourseByName(title);
      if (existingCourse) {
        throw new Error("A course with this title already exists");
      }
    }
    console.log(input);
    return this.courseRepository.updateCourse(input);
  }

  async softDeleteCourse(id: string, userId: string): Promise<ICourse> {
    const course = await this.courseRepository.getCourseById(id);
    if (!course || course.deletedAt) {
      throw new Error("Course not found or already deleted");
    }
    if (course.createdBy !== userId) {
      throw new Error("Unauthorized: You can only delete your own courses");
    }
    return this.courseRepository.softDeleteCourse(id);
  }
}
