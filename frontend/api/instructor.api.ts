import { api } from "./api";
import { InstructorProfile, InstructorCourse } from "@/types/instructor.types";

export const getInstructorProfile = async (userId: string) => {
  const response = await api.get<InstructorProfile>(`/instructors/${userId}`);
  return response.data;
};

export const updateInstructorProfile = async (userId: string, data: Partial<InstructorProfile>) => {
  const response = await api.patch<InstructorProfile>(`/instructors/${userId}`, data);
  return response.data;
};

export const getInstructorCourses = async () => {
  const response = await api.get<InstructorCourse[]>("/instructors/courses");
  return response.data;
}; 