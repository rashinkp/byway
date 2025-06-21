'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { List, CheckCircle, XCircle, BookOpen, Users, Clock, AlertCircle, DollarSign, Activity, Calendar } from 'lucide-react';
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
          return <List className="h-4 w-4" />;
        case 'check':
          return <CheckCircle className="h-4 w-4" />;
        case 'x':
          return <XCircle className="h-4 w-4" />;
        case 'book':
          return <BookOpen className="h-4 w-4" />;
        case 'users':
          return <Users className="h-4 w-4" />;
        case 'clock':
          return <Clock className="h-4 w-4" />;
        case 'alert':
          return <AlertCircle className="h-4 w-4" />;
        case 'dollar':
          return <DollarSign className="h-4 w-4" />;
        case 'activity':
          return <Activity className="h-4 w-4" />;
        case 'calendar':
          return <Calendar className="h-4 w-4" />;
        default:
          return null;
      }
    }
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('total')) return <List className="h-4 w-4" />;
    if (lowerTitle.includes('active')) return <CheckCircle className="h-4 w-4" />;
    if (lowerTitle.includes('inactive')) return <XCircle className="h-4 w-4" />;
    if (lowerTitle.includes('pending')) return <Clock className="h-4 w-4" />;
    if (lowerTitle.includes('declined')) return <AlertCircle className="h-4 w-4" />;
    if (lowerTitle.includes('revenue')) return <DollarSign className="h-4 w-4" />;
    if (lowerTitle.includes('courses')) return <BookOpen className="h-4 w-4" />;
    if (lowerTitle.includes('users')) return <Users className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  // Get background color based on title
  const getBgColor = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('total')) return 'bg-blue-50';
    if (lowerTitle.includes('active')) return 'bg-emerald-50';
    if (lowerTitle.includes('inactive')) return 'bg-rose-50';
    if (lowerTitle.includes('pending')) return 'bg-amber-50';
    if (lowerTitle.includes('declined')) return 'bg-orange-50';
    if (lowerTitle.includes('approved')) return 'bg-green-50';
    if (lowerTitle.includes('published')) return 'bg-indigo-50';
    if (lowerTitle.includes('draft')) return 'bg-gray-50';
    if (lowerTitle.includes('archived')) return 'bg-slate-50';
    if (lowerTitle.includes('revenue')) return 'bg-blue-50';
    if (lowerTitle.includes('courses')) return 'bg-purple-50';
    if (lowerTitle.includes('users')) return 'bg-indigo-50';
    return 'bg-gray-50';
  };

  // Get text color based on title
  const getTextColor = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('total')) return 'text-blue-600';
    if (lowerTitle.includes('active')) return 'text-emerald-600';
    if (lowerTitle.includes('inactive')) return 'text-rose-600';
    if (lowerTitle.includes('pending')) return 'text-amber-600';
    if (lowerTitle.includes('declined')) return 'text-orange-600';
    if (lowerTitle.includes('approved')) return 'text-green-600';
    if (lowerTitle.includes('published')) return 'text-indigo-600';
    if (lowerTitle.includes('draft')) return 'text-gray-600';
    if (lowerTitle.includes('archived')) return 'text-slate-600';
    if (lowerTitle.includes('revenue')) return 'text-blue-600';
    if (lowerTitle.includes('courses')) return 'text-purple-600';
    if (lowerTitle.includes('users')) return 'text-indigo-600';
    return 'text-gray-600';
  };

  // Animation variants for fade-in
  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.03, duration: 0.2 },
    }),
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={index}
        >
          <div className={`${getBgColor(stat.title)} backdrop-blur-sm border border-gray-200/50 rounded-lg p-4 hover:bg-white/80 transition-all duration-200 hover:shadow-sm`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`${getTextColor(stat.title)} opacity-75`}>
                {getIcon(stat.title, stat.icon)}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {stat.value}
              </h3>
              <p className={`text-xs font-medium ${getTextColor(stat.title)} uppercase tracking-wide`}>
                {stat.title}
              </p>
              {stat.description && (
                <p className="text-xs text-gray-500">{stat.description}</p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
