"use client";
import { cn } from "@/utils/cn";
import { Star,} from "lucide-react";
import { useRouter } from "next/navigation";
import { Course } from "@/types/course";
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
    router.push(`/user/my-courses/${course.id}`);
  };

  const handleGoToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push('/user/cart');
  };

  return (
    <div className={cn(
      "rounded-lg shadow-lg cursor-pointer overflow-hidden max-w-sm mx-auto hover:shadow-xl transition-shadow duration-300 ",
      className
    )}
    style={{ background: "var(--color-surface)", color: "var(--color-primary-dark)", height: "400px", minHeight: "400px" }}
    >
      {/* Hero Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.thumbnail || "/placeHolder.jpg"}
          alt={course.title}
          className="w-full h-full object-cover"
        />
      </div>
      {/* Content */}
      <div className="p-6 flex flex-col">
        {/* Profile Section */}
        <div className="flex items-center gap-2 mb-3">
          <img
            src={(course.instructor && 'profileImage' in course.instructor && (course.instructor as any).profileImage) || "/UserProfile.jpg"}
            alt={course.instructor?.name || "Instructor"}
            className="w-9 h-9 rounded-full object-cover"
          />
          <div>
             <h3 className="font-medium text-sm text-[var(--color-primary-dark)]">{course.instructor?.name || "Unknown"}</h3>
             <p className="text-xs text-[var(--color-primary-light)]">{(course.instructor && 'role' in course.instructor && (course.instructor as any).role) || "Instructor"}</p>
          </div>
        </div>
        {/* Title */}
        <h2 className="text-xl font-bold mb-1 line-clamp-1" style={{ color: "var(--foreground)" }}>
          <span className="text-[var(--color-primary-dark)]">{course.title}</span>
        </h2>
        {/* Description */}
        <p className="text-sm mb-1 leading-relaxed line-clamp-2 text-[var(--color-primary-light)]">
          {course.description || "No description available."}
        </p>
        {/* Rating */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-2xl font-bold text-[var(--color-primary-dark)]">
            {course.reviewStats?.averageRating?.toFixed(1) || "0.0"}
          </span>
          <Star className="w-5 h-5 text-[var(--color-primary-light)]" />
          <span className="text-sm text-[var(--color-primary-light)]">
            ({course.reviewStats?.totalReviews || 0} reviews)
          </span>
        </div>
      </div>
    </div>
  );
}
