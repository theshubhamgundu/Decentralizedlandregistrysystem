import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth-context';
import { DashboardStats } from '../components/DashboardStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { dashboardAPI, propertyAPI, transactionAPI } from '../lib/api';
import { DashboardStats as DashboardStatsType, Property, Transaction } from '../types';
import { Loader2, TrendingUp, Activity, AlertCircle } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStatsType | null>(null);
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, properties, transactions] = await Promise.all([
        dashboardAPI.getStats(),
        propertyAPI.getAll(),
        transactionAPI.getAll(),
      ]);

      setStats(statsData);
      setRecentProperties(properties.slice(0, 3));
      setRecentTransactions(transactions.slice(0, 3));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const getRoleGreeting = () => {
    switch (user?.role) {
      case 'ADMIN':
        return 'System Overview';
      case 'INSPECTOR':
        return 'Inspection Dashboard';
      case 'SELLER':
        return 'Seller Portal';
      case 'BUYER':
        return 'Buyer Portal';
      default:
        return 'Dashboard';
    }
  };

  const getRoleDescription = () => {
    switch (user?.role) {
      case 'ADMIN':
        return 'Monitor system health, manage users, and oversee all operations.';
      case 'INSPECTOR':
        return 'Review and approve pending transactions to maintain ledger integrity.';
      case 'SELLER':
        return 'Manage your properties and track sales transactions.';
      case 'BUYER':
        return 'Browse available properties and track your purchase requests.';
      default:
        return 'Welcome to DLRS';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl mb-2">Welcome back, {user?.fullName}!</h1>
        <p className="text-gray-500">{getRoleDescription()}</p>
      </div>

      {/* Stats */}
      {stats && <DashboardStats stats={stats} />}

      {/* Role-specific Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Recent Properties
            </CardTitle>
            <CardDescription>Latest registered properties</CardDescription>
          </CardHeader>
          <CardContent>
            {recentProperties.length > 0 ? (
              <div className="space-y-4">
                {recentProperties.map((property) => (
                  <div
                    key={property.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{property.title}</p>
                      <p className="text-sm text-gray-500">{property.propertyUid}</p>
                    </div>
                    <Badge
                      className={
                        property.status === 'FOR_SALE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }
                    >
                      {property.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onNavigate('properties')}
                >
                  View All Properties
                </Button>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No properties yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Recent Transactions
            </CardTitle>
            <CardDescription>Latest transaction activity</CardDescription>
          </CardHeader>
          <CardContent>
            {recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{transaction.propertyTitle}</p>
                      <p className="text-sm text-gray-500">
                        {transaction.sellerName} → {transaction.buyerName}
                      </p>
                    </div>
                    <Badge
                      className={
                        transaction.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : transaction.status === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {transaction.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onNavigate('transactions')}
                >
                  View All Transactions
                </Button>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No transactions yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Inspector-specific: Pending Reviews */}
      {user?.role === 'INSPECTOR' && stats && stats.pendingTransactions > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800">
              <AlertCircle className="mr-2 h-5 w-5" />
              Action Required
            </CardTitle>
            <CardDescription>
              You have {stats.pendingTransactions} pending transaction(s) awaiting review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => onNavigate('transactions')}>
              Review Pending Transactions
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Admin-specific: System Health */}
      {user?.role === 'ADMIN' && (
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Overall system status and integrity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Blockchain Integrity</span>
              {stats?.chainValid ? (
                <Badge className="bg-green-100 text-green-800">Valid</Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800">Needs Verification</Badge>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span>Total Blocks</span>
              <span>{stats?.totalBlocks}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Last Verification</span>
              <span className="text-sm text-gray-500">
                {stats?.lastVerification
                  ? new Date(stats.lastVerification).toLocaleString()
                  : 'Never'}
              </span>
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => onNavigate('blockchain')}
            >
              View Blockchain Ledger
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
