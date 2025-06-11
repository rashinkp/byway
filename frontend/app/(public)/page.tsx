'use client'

import { CategoryCard } from "@/components/category/CategoryCard";
import { TopCourses } from "@/components/course/TopCourseList";
import { StatsCard } from "@/components/DashboardStats";
import { HeroSection } from "@/components/HeroSection";
import { TopInstructors } from "@/components/instructor/TopInstructor";
import { Atom, Code, Megaphone, Telescope } from "lucide-react";
import { useCategories } from "@/hooks/category/useCategories";
import { useRouter } from "next/navigation";

export default function UserDashboard() {
  const router = useRouter();
  const { data: categoriesData, isLoading: isCategoriesLoading } = useCategories({
    page: 1,
    limit: 4,
    filterBy: "Active"
  });

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/courses?category=${categoryId}`);
  };

  const topCourses = [
    {
      id: "1",
      thumbnail:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      title: "Beginner's Guide to Design",
      tutorName: "Ronald Richards",
      rating: 4.9,
      reviewCount: 1200,
      duration: "22 Total Hours",
      formattedDuration: "22 Total Hours",
      lessons: 155,
      price: 149.9,
      bestSeller: true,
    },
    {
      thumbnail:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      title: "Beginner's Guide to Design",
      tutorName: "Ronald Richards",
      rating: 4.9,
      reviewCount: 1200,
      duration: "22 Total Hours",
      lessons: 155,
      price: 149.9,
      bestSeller: false,
    },
    {
      thumbnail:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      title: "Beginner's Guide to Design",
      tutorName: "Ronald Richards",
      rating: 4.9,
      reviewCount: 1200,
      duration: "22 Total Hours",
      lessons: 155,
      price: 149.9,
      bestSeller: false,
    },
    {
      thumbnail:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      title: "Beginner's Guide to Design",
      tutorName: "Ronald Richards",
      rating: 4.9,
      reviewCount: 1200,
      duration: "22 Total Hours",
      lessons: 155,
      price: 149.9,
      bestSeller: false,
    },
  ];

  const allCourses = [
    {
      thumbnail:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      title: "Master Web Development with React and Node.js",
      tutorName: "John Doe",
      rating: 4.7,
      reviewCount: 1243,
      duration: "12h 30m",
      lessons: 45,
      price: 49.99,
      bestSeller: true,
    },
    {
      thumbnail:
        "https://images.unsplash.com/photo-1501504906304-e396f752d904?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      title: "Introduction to Data Science with Python",
      tutorName: "Jane Smith",
      rating: 4.5,
      reviewCount: 892,
      duration: "8h 15m",
      lessons: 30,
      price: 39.99,
      bestSeller: false,
    },
    {
      thumbnail:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      title: "UI/UX Design Fundamentals",
      tutorName: "Alex Brown",
      rating: 4.8,
      reviewCount: 567,
      duration: "6h 45m",
      lessons: 25,
      price: 29.99,
      bestSeller: false,
    },
    {
      thumbnail:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      title: "UI/UX Design Fundamentals",
      tutorName: "Alex Brown",
      rating: 4.8,
      reviewCount: 567,
      duration: "6h 45m",
      lessons: 25,
      price: 29.99,
      bestSeller: false,
    },
  ];

  const stats = [
    { value: "250+", description: "Courses by our best mentors" },
    { value: "1000+", description: "Courses by our best mentors" },
    { value: "15+", description: "Courses by our best mentors" },
    { value: "2400+", description: "Courses by our best mentors" },
  ];

  const categories = categoriesData?.items.map(category => ({
    id: category.id,
    name: category.name,
    courseCount: 0, // This will need to be updated when we have course count data
    icon: <Code className="w-5 h-5 text-blue-500" />, // Default icon, can be customized based on category
  })) || [];

  const topInstructors = [
    {
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      name: "Jacob Jones",
      role: "UI/UX Designer",
      courseCount: 12,
    },
    {
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      name: "Jenny Wilson",
      role: "Developer",
      courseCount: 15,
    },
    {
      image:
        "https://images.unsplash.com/photo-1517841903200-7a706fc245bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      name: "Ronald Richards",
      role: "Marketer",
      courseCount: 10,
    },
    {
      image:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      name: "Esther Howard",
      role: "Astrologer",
      courseCount: 8,
    },
    {
      image:
        "https://images.unsplash.com/photo-1517841903200-7a706fc245bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      name: "Ronald Richards",
      role: "Marketer",
      courseCount: 10,
    },
    {
      image:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      name: "Esther Howard",
      role: "Astrologer",
      courseCount: 8,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection className="mb-12" />
      <StatsCard stats={stats} className="mb-8" />
      <CategoryCard 
        categories={categories} 
        className="mb-8" 
        onCategoryClick={handleCategoryClick}
      />
      <TopCourses courses={topCourses} className="mb-8" />
      <TopInstructors instructors={topInstructors} className="mb-8" />
    </div>
  );
}
