'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { List, CheckCircle, XCircle, BookOpen } from 'lucide-react';
import { Stat } from "@/types/common";

interface StatsCardsProps {
  stats: Stat<any>[];
}

export function StatsCards({ stats }: StatsCardsProps) {
  // Map stat titles to icons if not provided
  const getIcon = (title: string, icon?: string) => {
    if (icon) {
      switch (icon) {
        case 'list':
          return <List className="h-6 w-6" />;
        case 'check':
          return <CheckCircle className="h-6 w-6" />;
        case 'x':
          return <XCircle className="h-6 w-6" />;
        case 'book':
          return <BookOpen className="h-6 w-6" />;
        default:
          return null;
      }
    }
    switch (title.toLowerCase()) {
      case 'total categories':
        return <List className="h-6 w-6" />;
      case 'active categories':
        return <CheckCircle className="h-6 w-6" />;
      case 'inactive categories':
        return <XCircle className="h-6 w-6" />;
      case 'total courses':
        return <BookOpen className="h-6 w-6" />;
      default:
        return null;
    }
  };

  // Animation variants for fade-in
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.1, duration: 0.3 },
    }),
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stat.value}
            </div>
            {stat.description && (
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
