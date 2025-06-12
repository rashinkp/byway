"use client";

import { Course } from "@/types/course";
import { Edit, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StaticImageData } from "next/image";
import { useState } from "react";
import { useSoftDeleteCourse } from "@/hooks/course/useSoftDeleteCourse";
import { toast } from "sonner";
import { ImageSection } from "./CourseDetailsImageSection";
import { DetailsSection } from "./CourseDetailsSection";
import { OverviewSection } from "./CourseOverviewSection";

import { ActionSection } from "./CourseActionSection";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseFormModal } from "./CourseFormModal";
import { AdditionalDetailsSection } from "./CourseAdditionalDetails";

export function CourseDetails({
  course,
  src,
  alt,
  isLoading,
}: {
  course?: Course;
  src: string | StaticImageData;
  alt: string;
  isLoading: boolean;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);


  const onPublish = () => {
    if (!course) return;
    setIsModalOpen(true); 
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 w-32 bg-gray-200 rounded"></div>
        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6">
        <ImageSection
          src={src}
          alt={alt}
        />
        <div className="flex-1">
         
          <DetailsSection course={course} />
        </div>
      </div>
      <Tabs defaultValue="overview" className="w-full">
        <OverviewSection course={course} isEditing={isLoading} form={{}} />
        <AdditionalDetailsSection course={course} />
      </Tabs>
      {course && (
        <ActionSection
          course={course}
          isUpdating={false}
          onPublish={onPublish}
          isEditing={isLoading}
          setIsModalOpen={setIsModalOpen}
        />
      )}
      {course && (
        <CourseFormModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          initialData={{
            id: course.id,
            title: course.title,
            description: course.description || undefined,
            level: course.level,
            price: Number(course.price) || undefined,
            duration: course.duration || 0,
            offer: Number(course.offer) || undefined,
            status: course.status,
            thumbnail: course.thumbnail || undefined,
            categoryId: course.categoryId,
            prerequisites: course.details?.prerequisites || undefined,
            longDescription: course.details?.longDescription || undefined,
            objectives: course.details?.objectives || undefined,
            targetAudience: course.details?.targetAudience || undefined,
            adminSharePercentage: course.adminSharePercentage || 20,
          }}
        />
      )}
    </div>
  );
}
