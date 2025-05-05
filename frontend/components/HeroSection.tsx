import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { cn } from "@/utils/cn";

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  // Dummy data
  const headline = "Unlock Your Potential with Byway 🚀";
  const description =
    "Welcome to Byway, where learning knows no bounds. We believe that education is the key to personal and professional growth, and we're here to guide you on your journey to success. 🌟";
  const communityStats = {
    students: 1200,
    label: "Join our community 🎉",
  };
  const images = [
    {
      src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      bgColor: "bg-blue-200",
      className: "top-10 right-10 w-32 h-32 md:w-40 md:h-40",
    },
    {
      src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      bgColor: "bg-pink-300",
      className: "top-40 right-20 w-36 h-36 md:w-48 md:h-48",
    },
    {
      src: "https://images.unsplash.com/photo-1517841903200-7a706fc245bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      bgColor: "bg-yellow-300",
      className: "top-60 right-10 w-32 h-32 md:w-40 md:h-40",
    },
  ];

  return (
    <section
      className={cn(
        "relative container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center",
        className
      )}
    >
      {/* Text Section */}
      <div className="md:w-1/2 mb-12 md:mb-0">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
          {headline}
        </h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          {description}
        </p>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 text-lg font-medium">
          Start your instructor journey
        </Button>
      </div>

      {/* Image Section */}
      <div className="md:w-1/2 relative h-64 md:h-96">
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              "absolute rounded-full border-4 border-white shadow-md overflow-hidden",
              image.className,
              image.bgColor
            )}
          >
            <img
              src={image.src}
              alt="Student"
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Community Stats */}
        <div className="absolute bottom-0 right-0 bg-white shadow-lg rounded-lg p-4 flex items-center gap-3 border border-gray-100">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">
              {communityStats.label}
            </p>
            <p className="text-lg font-bold text-gray-800">
              {communityStats.students.toLocaleString()} + Students
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
