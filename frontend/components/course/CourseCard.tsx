"use client";
import { cn } from "@/utils/cn";
import { useState } from "react";
import { Star, Clock, BookOpen } from "lucide-react";

interface CourseCardProps {
  id: string;
  thumbnail: string;
  title: string;
  rating: number;
  reviewCount: number;
  lessons: number;
  price: number | string;
  bestSeller?: boolean;
  className?: string;
  formattedDuration: string;
}

export function CourseCard({
  id,
  thumbnail,
  title,
  rating,
  reviewCount,
  lessons,
  price,
  bestSeller = false,
  className,
  formattedDuration: duration,
}: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  

  // Format price to display with 2 decimal places
  const formattedPrice = typeof price === 'number' ? price.toFixed(2) : Number(price).toFixed(2);

  // Function to render star rating
  const renderStars = (rating: number) => {
    const starCount = 5;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex">
        {[...Array(starCount)].map((_, i) => (
          <Star
            key={i}
            size={12}
            className={cn(
              "stroke-current",
              i < fullStars
                ? "text-yellow-400 fill-yellow-400"
                : i === fullStars && hasHalfStar
                ? "text-yellow-400 fill-yellow-400/50"
                : "text-gray-300"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-white rounded-lg border border-gray-200 transition-shadow duration-200 w-[320px] h-[320px]",
        isHovered && "shadow-md",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail */}
      <div className="h-[180px] overflow-hidden rounded-t-lg relative">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover"
        />
        {/* Best seller badge */}
        {bestSeller && (
          <div className="absolute top-2 left-2">
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-1.5 py-0.5 rounded">
              Best Seller
            </span>
          </div>
        )}
      </div>

      {/* Course info */}
      <div className="flex flex-col flex-grow p-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex items-center gap-1">
            {renderStars(rating)}
            <span className="text-xs font-medium text-gray-600 ml-1">
              {rating}
            </span>
          </div>
          <span className="text-xs text-gray-400">({reviewCount})</span>
        </div>

        <h3 className="text-base font-semibold text-gray-800 line-clamp-2 mb-2 max-h-[40px] overflow-hidden">
          {title}
        </h3>

        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Clock size={12} className="text-gray-400" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen size={12} className="text-gray-400" />
            <span>{lessons} lessons</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="font-semibold text-base text-gray-800">
            ${formattedPrice}
          </span>
        </div>
      </div>
    </div>
  );
}
