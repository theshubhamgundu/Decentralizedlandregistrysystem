import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Building2, FileText, Clock, Blocks, CheckCircle2, AlertCircle } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  variant?: 'default' | 'success' | 'warning';
}

function StatCard({ title, value, icon, description, variant = 'default' }: StatCardProps) {
  const variantClasses = {
    default: 'bg-blue-50 text-blue-600',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-orange-50 text-orange-600',
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${variantClasses[variant]}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl">{value}</div>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

interface DashboardStatsProps {
  stats: {
    totalProperties: number;
    totalTransactions: number;
    pendingTransactions: number;
    totalBlocks: number;
    chainValid?: boolean;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Properties"
        value={stats.totalProperties}
        icon={<Building2 className="h-4 w-4" />}
        description="Registered in the system"
      />
      <StatCard
        title="Total Transactions"
        value={stats.totalTransactions}
        icon={<FileText className="h-4 w-4" />}
        description="All time transactions"
      />
      <StatCard
        title="Pending Transactions"
        value={stats.pendingTransactions}
        icon={<Clock className="h-4 w-4" />}
        description="Awaiting approval"
        variant="warning"
      />
      <StatCard
        title="Blockchain Blocks"
        value={stats.totalBlocks}
        icon={<Blocks className="h-4 w-4" />}
        description={stats.chainValid ? 'Chain verified ✓' : 'Verification needed'}
        variant={stats.chainValid ? 'success' : 'default'}
      />
    </div>
  );
}
