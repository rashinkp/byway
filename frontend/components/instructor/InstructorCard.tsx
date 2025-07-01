import React from "react";
import { Star } from "lucide-react";

interface InstructorCardProps {
  instructor: {
    id: string;
    name: string;
    role: string;
    description: string;
    image: string;
    rating: number;
    reviewCount: number;
  };
}

export function InstructorCard({ instructor }: InstructorCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden max-w-xs w-full flex flex-col">
      <div className="h-40 w-full overflow-hidden">
        <img
          src={instructor.image}
          alt={instructor.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-[var(--color-primary-dark)] mb-1 line-clamp-1">{instructor.name}</h3>
        <p className="text-sm text-[var(--color-primary-light)] mb-1 line-clamp-1">{instructor.role}</p>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{instructor.description}</p>
        <div className="flex items-center gap-2 mt-auto">
          <span className="text-base font-bold text-[var(--color-primary-dark)]">{instructor.rating}</span>
          <Star className="w-5 h-5 text-[var(--color-primary-light)]" />
          <span className="text-sm text-[var(--color-primary-light)]">({instructor.reviewCount} reviews)</span>
        </div>
      </div>
    </div>
  );
} 