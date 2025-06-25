"use client";
import { cn } from "@/utils/cn";
import { useState } from "react";
import { Star, Clock, User, ShoppingCart, CheckCircle, BookOpen, Play, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { Course } from "@/types/course";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAddToCart } from "@/hooks/cart/useAddToCart";
import { useAuth } from "@/hooks/auth/useAuth";

interface CourseCardProps {
  course: Course;
  className?: string;
}

export function CourseCard({
  course,
  className,
}: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { mutate: addToCart, isPending: isCartLoading } = useAddToCart();

  // Format price to display with 2 decimal places
  const formatPrice = (price: number | string | null | undefined): string => {
    if (price === null || price === undefined) return "Free";
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice === 0 ? "Free" : `$${numPrice.toFixed(2)}`;
  };

  // Calculate discounted price
  const getDiscountedPrice = (): string => {
    const price = typeof course.price === 'number' ? course.price : parseFloat(course.price || '0');
    const offer = typeof course.offer === 'number' ? course.offer : parseFloat(course.offer || '0');
    
    if (offer > 0 && offer < price) {
      return formatPrice(offer);
    }
    return formatPrice(price);
  };

  const getOriginalPrice = (): string => {
    const price = typeof course.price === 'number' ? course.price : parseFloat(course.price || '0');
    const offer = typeof course.offer === 'number' ? course.offer : parseFloat(course.offer || '0');
    
    if (offer > 0 && offer < price) {
      return formatPrice(price);
    }
    return "";
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const handleCardClick = () => {
    router.push(`/courses/${course.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      router.push("/login");
      return;
    }
    if (course?.id) {
      addToCart({ courseId: course.id });
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      router.push("/login");
      return;
    }
    if (course?.id) {
      router.push(`/user/checkout?courseId=${course.id}`);
    }
  };

  const handleLearnNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/user/profile?section=courses&courseId=${course.id}`);
  };

  const handleGoToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push('/user/cart');
  };

  return (
    <div
      className={cn(
        "group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden h-full flex flex-col w-80",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.thumbnail || "/placeHolder.jpg"}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
        
        {/* Level Badge */}
        <Badge 
          variant="secondary" 
          className="absolute top-3 left-3 bg-white/90 text-gray-700 hover:bg-white text-xs"
        >
          {course.level}
        </Badge>

        {/* Best Seller Badge */}
        {course.bestSeller && (
          <Badge 
            variant="default" 
            className="absolute top-3 right-3 bg-orange-500 hover:bg-orange-600 text-xs"
          >
            Best Seller
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Reviews */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            {renderStars(course.reviewStats?.averageRating || 0)}
          </div>
          <span className="text-sm text-gray-600">
            {course.reviewStats?.averageRating?.toFixed(1) || "0.0"}
          </span>
          <span className="text-sm text-gray-500">
            ({course.reviewStats?.totalReviews || 0})
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors text-sm leading-tight">
          {course.title}
        </h3>

        {/* Instructor */}
        {course.instructor && (
          <p className="text-xs text-gray-600 mb-2">
            by {course.instructor.name}
          </p>
        )}

        {/* Course Info */}
        <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            <span>{course.lessons || 0} lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{course.duration || 0}h</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base font-bold text-gray-900">
            {getDiscountedPrice()}
          </span>
          {getOriginalPrice() && (
            <span className="text-sm text-gray-500 line-through">
              {getOriginalPrice()}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          {course.isEnrolled ? (
            <Button 
              onClick={handleLearnNow}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs py-2"
            >
              <Play className="w-3 h-3 mr-1" />
              Learn Now
            </Button>
          ) : course.isInCart ? (
            <Button 
              onClick={handleGoToCart}
              className="flex-1 bg-green-600 hover:bg-green-700 text-xs py-2"
            >
              <ShoppingCart className="w-3 h-3 mr-1" />
              Go to Cart
            </Button>
          ) : (
            <>
              <Button 
                onClick={handleAddToCart}
                variant="outline"
                className="flex-1 text-xs py-2"
                disabled={isCartLoading}
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                {isCartLoading ? "Adding..." : "Add to Cart"}
              </Button>
              <Button 
                onClick={handleBuyNow}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs py-2"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Buy Now
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
