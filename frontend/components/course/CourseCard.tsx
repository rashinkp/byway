'use client'
import { cn } from "@/utils/cn";
import { useState } from "react";
import { Star, Clock, BookOpen, ChevronRight } from "lucide-react";

interface CourseCardProps {
  thumbnail: string;
  title: string;
  tutorName: string;
  rating: number;
  reviewCount: number;
  duration: string;
  lessons: number;
  price: number;
  bestSeller?: boolean;
  className?: string;
}

export function CourseCard({
  thumbnail,
  title,
  tutorName,
  rating,
  reviewCount,
  duration,
  lessons,
  price,
  bestSeller = false,
  className,
}: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Format price to display with 2 decimal places
  const formattedPrice = price.toFixed(2);

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
            size={14}
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
        "flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 transition-all duration-300",
        isHovered && "shadow-lg transform translate-y-[-4px]",
        !isHovered && "shadow-sm",
        "w-full h-full",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail with overlay */}
      <div className="relative overflow-hidden h-52">
        <img
          src={thumbnail}
          alt={title}
          className={cn(
            "w-full h-full object-cover transition-transform duration-700",
            isHovered && "scale-110"
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 flex items-end p-4">
          <button className="bg-white text-blue-600 py-2 px-4 rounded-lg font-medium text-sm flex items-center gap-1 opacity-0 transform translate-y-4 transition-all duration-300">
            Preview Course <ChevronRight size={16} />
          </button>
        </div>

        {/* Best seller badge */}
        {bestSeller && (
          <div className="absolute top-4 left-4">
            <span className="bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-1 rounded-md">
              BEST SELLER
            </span>
          </div>
        )}
      </div>

      {/* Course info */}
      <div className="flex flex-col flex-grow p-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            {renderStars(rating)}
            <span className="text-sm font-medium text-gray-700 ml-1">
              {rating}
            </span>
          </div>
          <span className="text-xs text-gray-400">({reviewCount} reviews)</span>
        </div>

        <h3 className="text-lg font-bold text-gray-800 line-clamp-2 mb-2">
          {title}
        </h3>

        <p className="text-sm text-gray-500 mb-3">By {tutorName}</p>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Clock size={14} className="text-gray-400" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen size={14} className="text-gray-400" />
            <span>{lessons} lessons</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="font-bold text-lg text-blue-600">
            ${formattedPrice}
          </span>
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
}
