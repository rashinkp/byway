'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { List, CheckCircle, XCircle, BookOpen, Users, Clock, AlertCircle } from 'lucide-react';
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
          return <List className="h-3.5 w-3.5" />;
        case 'check':
          return <CheckCircle className="h-3.5 w-3.5" />;
        case 'x':
          return <XCircle className="h-3.5 w-3.5" />;
        case 'book':
          return <BookOpen className="h-3.5 w-3.5" />;
        case 'users':
          return <Users className="h-3.5 w-3.5" />;
        case 'clock':
          return <Clock className="h-3.5 w-3.5" />;
        case 'alert':
          return <AlertCircle className="h-3.5 w-3.5" />;
        default:
          return null;
      }
    }
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('total')) return <List className="h-3.5 w-3.5" />;
    if (lowerTitle.includes('active')) return <CheckCircle className="h-3.5 w-3.5" />;
    if (lowerTitle.includes('inactive')) return <XCircle className="h-3.5 w-3.5" />;
    if (lowerTitle.includes('pending')) return <Clock className="h-3.5 w-3.5" />;
    if (lowerTitle.includes('declined')) return <AlertCircle className="h-3.5 w-3.5" />;
    return null;
  };

  // Get background color based on title
  const getBgColor = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('total')) return 'bg-blue-50/50';
    if (lowerTitle.includes('active')) return 'bg-emerald-50/50';
    if (lowerTitle.includes('inactive')) return 'bg-rose-50/50';
    if (lowerTitle.includes('pending')) return 'bg-amber-50/50';
    if (lowerTitle.includes('declined')) return 'bg-orange-50/50';
    return 'bg-gray-50/50';
  };

  // Get text color based on title
  const getTextColor = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('total')) return 'text-blue-600';
    if (lowerTitle.includes('active')) return 'text-emerald-600';
    if (lowerTitle.includes('inactive')) return 'text-rose-600';
    if (lowerTitle.includes('pending')) return 'text-amber-600';
    if (lowerTitle.includes('declined')) return 'text-orange-600';
    return 'text-gray-600';
  };

  // Animation variants for fade-in
  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.05, duration: 0.2 },
    }),
  };

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={index}
        >
          <Card className={`${getBgColor(stat.title)} border-0 shadow-sm hover:shadow-md transition-shadow duration-200`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2.5">
              <CardTitle className={`text-[11px] font-medium tracking-wide uppercase ${getTextColor(stat.title)}`}>
                {stat.title}
              </CardTitle>
              <div className={`${getTextColor(stat.title)} opacity-75`}>
                {getIcon(stat.title, stat.icon)}
              </div>
            </CardHeader>
            <CardContent className="p-2.5 pt-0">
              <div className={`text-lg font-semibold ${getTextColor(stat.title)}`}>
                {stat.value}
              </div>
              {stat.description && (
                <p className="text-[10px] text-gray-500 mt-0.5">{stat.description}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
