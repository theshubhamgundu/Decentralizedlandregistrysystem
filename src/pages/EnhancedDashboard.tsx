import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth-context';
import { EnhancedDashboardStats } from '../components/EnhancedDashboardStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { dashboardAPI, propertyAPI, transactionAPI } from '../lib/api';
import { DashboardStats as DashboardStatsType, Property, Transaction } from '../types';
import { 
  Loader2, TrendingUp, Activity, AlertCircle, ArrowRight,
  Sparkles, Shield, Zap, Clock, CheckCircle2
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';
import { Progress } from '../components/ui/progress';

interface EnhancedDashboardProps {
  onNavigate: (page: string) => void;
}

export function EnhancedDashboard({ onNavigate }: EnhancedDashboardProps) {
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
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  const getRoleGreeting = () => {
    const greetings = {
      ADMIN: { title: 'System Administrator', icon: Shield, color: 'from-purple-500 to-pink-500' },
      INSPECTOR: { title: 'Property Inspector', icon: Shield, color: 'from-blue-500 to-cyan-500' },
      SELLER: { title: 'Property Seller', icon: Sparkles, color: 'from-green-500 to-emerald-500' },
      BUYER: { title: 'Property Buyer', icon: Zap, color: 'from-orange-500 to-red-500' },
    };
    return greetings[user?.role as keyof typeof greetings] || greetings.BUYER;
  };

  const roleInfo = getRoleGreeting();
  const RoleIcon = roleInfo.icon;

  return (
    <div className="space-y-8">
      {/* Welcome Hero Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${roleInfo.color} p-8 text-white shadow-2xl`}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <RoleIcon className="h-6 w-6" />
                <Badge className="bg-white/20 text-white border-0">
                  {roleInfo.title}
                </Badge>
              </div>
              <h1 className="text-4xl mb-2">
                Welcome back, {user?.fullName}! 👋
              </h1>
              <p className="text-lg opacity-90">
                {user?.role === 'ADMIN' && 'Monitor system health and oversee all operations'}
                {user?.role === 'INSPECTOR' && 'Review pending transactions and maintain ledger integrity'}
                {user?.role === 'SELLER' && 'Manage your properties and track sales'}
                {user?.role === 'BUYER' && 'Browse properties and track your purchases'}
              </p>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm opacity-90 mb-1">Last Login</p>
              <p className="text-lg font-semibold">Today</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm opacity-90 mb-1">Active Since</p>
              <p className="text-lg font-semibold">
                {new Date(user?.createdAt || '').toLocaleDateString()}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm opacity-90 mb-1">User ID</p>
              <p className="text-lg font-semibold font-mono">#{user?.id}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm opacity-90 mb-1">Status</p>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-lg font-semibold">Active</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      {stats && <EnhancedDashboardStats stats={stats} />}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Properties */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Activity className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Recent Properties</CardTitle>
                    <CardDescription>Latest registered properties</CardDescription>
                  </div>
                </div>
                <Badge variant="outline">{recentProperties.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {recentProperties.length > 0 ? (
                <div className="space-y-3">
                  {recentProperties.map((property, index) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl hover:shadow-md transition-all cursor-pointer"
                      onClick={() => onNavigate('properties')}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{property.title}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <code className="text-xs bg-white px-2 py-0.5 rounded">
                            {property.propertyUid}
                          </code>
                          <span>•</span>
                          <span>{property.area} m²</span>
                        </div>
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
                    </motion.div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => onNavigate('properties')}
                  >
                    View All Properties
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No properties yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Latest transaction activity</CardDescription>
                  </div>
                </div>
                <Badge variant="outline">{recentTransactions.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {recentTransactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl hover:shadow-md transition-all cursor-pointer"
                      onClick={() => onNavigate('transactions')}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{transaction.propertyTitle}</p>
                        <p className="text-sm text-gray-500 truncate">
                          {transaction.sellerName} → {transaction.buyerName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          ${transaction.amount.toLocaleString()}
                        </p>
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
                    </motion.div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => onNavigate('transactions')}
                  >
                    View All Transactions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No transactions yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Role-Specific Sections */}
      {user?.role === 'INSPECTOR' && stats && stats.pendingTransactions > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-orange-900">Action Required</CardTitle>
                  <CardDescription>
                    {stats.pendingTransactions} pending transaction(s) awaiting your review
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Progress value={(stats.pendingTransactions / 10) * 100} className="w-48 mb-2" />
                  <p className="text-sm text-gray-600">Review progress</p>
                </div>
                <Button 
                  onClick={() => onNavigate('transactions')}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Review Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {user?.role === 'ADMIN' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>Overall system status and blockchain integrity</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Blockchain Status</span>
                    {stats?.chainValid ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                    )}
                  </div>
                  <p className="text-xl font-bold">
                    {stats?.chainValid ? 'Valid' : 'Needs Check'}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-2">Total Blocks</p>
                  <p className="text-xl font-bold">{stats?.totalBlocks}</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onNavigate('blockchain')}
              >
                View Blockchain Ledger
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
