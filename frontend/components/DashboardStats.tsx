import { cn } from "@/utils/cn";

interface Stat {
  value: string;
  description: string;
}

interface StatsCardProps {
  stats: Stat[];
  className?: string;
}

export function StatsCard({ stats, className }: StatsCardProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-[var(--color-surface)] rounded-xl shadow-md",
        className
      )}
    >
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center text-center"
        >
          <h3 className="text-3xl font-bold text-[var(--color-primary-dark)] mb-2">
            {stat.value}
          </h3>
          <p className="text-sm text-[var(--color-primary-light)]">{stat.description}</p>
        </div>
      ))}
    </div>
  );
}

