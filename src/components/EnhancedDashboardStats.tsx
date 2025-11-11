import React from 'react';
import { DashboardStats } from '../types';
import { Card, CardContent } from './ui/card';
import { 
  Home, FileText, Clock, Database, TrendingUp, 
  Shield, Activity, Zap 
} from 'lucide-react';
import { motion } from 'motion/react';
import { Badge } from './ui/badge';

interface EnhancedDashboardStatsProps {
  stats: DashboardStats;
}

export function EnhancedDashboardStats({ stats }: EnhancedDashboardStatsProps) {
  const statCards = [
    {
      title: 'Total Properties',
      value: stats.totalProperties,
      icon: Home,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Total Transactions',
      value: stats.totalTransactions,
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'Pending Reviews',
      value: stats.pendingTransactions,
      icon: Clock,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      trend: stats.pendingTransactions > 0 ? 'Action needed' : 'All clear',
      trendUp: stats.pendingTransactions === 0,
    },
    {
      title: 'Blockchain Blocks',
      value: stats.totalBlocks,
      icon: Database,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      trend: stats.chainValid ? 'Verified ✓' : 'Verify needed',
      trendUp: stats.chainValid || false,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
            
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                  <div className="flex items-baseline gap-2">
                    <motion.h3
                      className="text-3xl"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                    >
                      {stat.value}
                    </motion.h3>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    {stat.trendUp ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <Activity className="h-3 w-3 text-orange-600" />
                    )}
                    <span className={`text-xs ${stat.trendUp ? 'text-green-600' : 'text-orange-600'}`}>
                      {stat.trend}
                    </span>
                  </div>
                </div>
                
                <motion.div
                  className={`p-3 rounded-xl ${stat.iconBg}`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </motion.div>
              </div>

              {/* Progress bar indicator */}
              <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${stat.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((stat.value / 10) * 100, 100)}%` }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
