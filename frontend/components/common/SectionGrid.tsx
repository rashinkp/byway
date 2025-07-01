import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

interface SectionGridProps<T> {
  title: React.ReactNode;
  items: T[];
  renderCard: (item: T) => React.ReactNode;
  className?: string;
  showNavigation?: boolean;
  onPrevClick?: () => void;
  onNextClick?: () => void;
}

export function SectionGrid<T>({
  title,
  items,
  renderCard,
  className,
  showNavigation = true,
  onPrevClick,
  onNextClick,
}: SectionGridProps<T>) {
  return (
    <section className={cn("mb-12 px-2 sm:px-0", className)}>
      <div className="mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[var(--color-primary-dark)]">
          {title}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-center">
            {renderCard(item)}
          </div>
        ))}
      </div>
      {showNavigation && (
        <div className="flex justify-start gap-3 mt-10">
          <Button variant="outline" onClick={onPrevClick}>
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button variant="outline" onClick={onNextClick}>
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      )}
    </section>
  );
} 