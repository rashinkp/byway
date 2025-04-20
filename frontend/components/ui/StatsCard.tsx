'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { List, CheckCircle, XCircle, BookOpen } from 'lucide-react';

interface Stat {
  title: string;
  value: number | string;
  color?: string;
  icon?: 'list' | 'check' | 'x' | 'book'; // Optional icon type
}

interface StatsCardsProps {
  stats: Stat[];
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={index}
        >
          <Card
            className={`
              relative overflow-hidden
              bg-gradient-to-br
              ${
                stat.color?.includes('green')
                  ? 'from-green-50 to-green-100'
                  : stat.color?.includes('red')
                  ? 'from-red-50 to-red-100'
                  : stat.color?.includes('blue')
                  ? 'from-blue-50 to-blue-100'
                  : 'from-gray-50 to-gray-100'
              }
              border-none shadow-lg
              transition-all duration-300
              hover:shadow-xl hover:scale-105
            `}
          >
            {/* Decorative corner accent */}
            <div
              className={`
                absolute top-0 left-0 w-3 h-3
                ${
                  stat.color?.includes('green')
                    ? 'bg-green-500'
                    : stat.color?.includes('red')
                    ? 'bg-red-500'
                    : stat.color?.includes('blue')
                    ? 'bg-blue-500'
                    : 'bg-gray-500'
                }
              `}
            />
            <CardHeader className="pb-2 flex items-center space-x-2">
              {getIcon(stat.title, stat.icon)}
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`
                  text-3xl font-extrabold
                  ${stat.color || 'text-gray-800'}
                  tracking-tight
                `}
              >
                {stat.value}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
