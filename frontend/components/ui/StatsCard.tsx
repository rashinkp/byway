// src/components/ui/StatsCards.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Stat {
  title: string;
  value: number | string;
  color?: string;
}

interface StatsCardsProps {
  stats: Stat[];
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color || ""}`}>
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
