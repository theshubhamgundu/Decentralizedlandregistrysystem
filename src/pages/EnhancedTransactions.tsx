import React, { useEffect, useState } from 'react';
import { Transaction } from '../types';
import { transactionAPI } from '../lib/api';
import { useAuth } from '../lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ApproveTransactionDialog } from '../components/ApproveTransactionDialog';
import {
  Loader2, FileText, Clock, CheckCircle2, XCircle,
  ArrowRight, DollarSign, User, Calendar, AlertCircle,
  TrendingUp, Activity, Filter
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';

export function EnhancedTransactions() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const data = await transactionAPI.getAll();
      setTransactions(data);
    } catch (error) {
      console.error('Failed to load transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowApproveDialog(true);
  };

  const handleTransactionApproved = (updatedTransaction: Transaction) => {
    setTransactions(
      transactions.map((t) =>
        t.id === updatedTransaction.id ? updatedTransaction : t
      )
    );
    toast.success('Transaction approved!', {
      description: 'A new block has been added to the blockchain.',
    });
  };

  const getStatusInfo = (status: string) => {
    const statusMap = {
      INITIATED: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        gradient: 'from-blue-500 to-cyan-500',
        icon: Clock,
        label: 'Initiated',
      },
      UNDER_REVIEW: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        gradient: 'from-yellow-500 to-orange-500',
        icon: AlertCircle,
        label: 'Under Review',
      },
      COMPLETED: {
        color: 'bg-green-100 text-green-800 border-green-200',
        gradient: 'from-green-500 to-emerald-500',
        icon: CheckCircle2,
        label: 'Completed',
      },
      REJECTED: {
        color: 'bg-red-100 text-red-800 border-red-200',
        gradient: 'from-red-500 to-pink-500',
        icon: XCircle,
        label: 'Rejected',
      },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.INITIATED;
  };

  const filterTransactionsByStatus = (status: string) => {
    if (status === 'all') return transactions;
    if (status === 'pending') {
      return transactions.filter(
        (t) => t.status === 'INITIATED' || t.status === 'UNDER_REVIEW'
      );
    }
    return transactions.filter((t) => t.status === status);
  };

  const filteredTransactions = filterTransactionsByStatus(activeTab);

  const stats = {
    total: transactions.length,
    pending: transactions.filter(
      (t) => t.status === 'INITIATED' || t.status === 'UNDER_REVIEW'
    ).length,
    completed: transactions.filter((t) => t.status === 'COMPLETED').length,
    rejected: transactions.filter((t) => t.status === 'REJECTED').length,
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
        <p className="text-gray-500">Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl mb-2">Transactions</h1>
        <p className="text-gray-600">
          Track and manage property ownership transfers
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <Badge variant="outline">{stats.total}</Badge>
              </div>
              <p className="text-sm text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <Badge variant="outline">{stats.pending}</Badge>
              </div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold mt-1">{stats.pending}</p>
              {stats.pending > 0 && (
                <Progress value={(stats.pending / stats.total) * 100} className="mt-2 h-1" />
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-green-100 rounded-xl">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <Badge variant="outline">{stats.completed}</Badge>
              </div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold mt-1">{stats.completed}</p>
              {stats.total > 0 && (
                <Progress 
                  value={(stats.completed / stats.total) * 100} 
                  className="mt-2 h-1 [&>div]:bg-green-600" 
                />
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-red-100 rounded-xl">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <Badge variant="outline">{stats.rejected}</Badge>
              </div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold mt-1">{stats.rejected}</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Tabs and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">
              All ({stats.total})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({stats.pending})
            </TabsTrigger>
            <TabsTrigger value="INITIATED">
              Initiated
            </TabsTrigger>
            <TabsTrigger value="COMPLETED">
              Completed
            </TabsTrigger>
            <TabsTrigger value="REJECTED">
              Rejected
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <AnimatePresence mode="wait">
              {filteredTransactions.length > 0 ? (
                <div className="space-y-4">
                  {filteredTransactions.map((transaction, index) => {
                    const statusInfo = getStatusInfo(transaction.status);
                    const StatusIcon = statusInfo.icon;

                    return (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="border-0 shadow-md hover:shadow-xl transition-all group">
                          <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row gap-6">
                              {/* Left: Status Indicator */}
                              <div className="flex lg:flex-col items-center lg:items-start gap-4">
                                <div className={`p-4 bg-gradient-to-br ${statusInfo.gradient} rounded-xl shadow-lg`}>
                                  <StatusIcon className="h-8 w-8 text-white" />
                                </div>
                                <Badge className={`${statusInfo.color} border`}>
                                  {statusInfo.label}
                                </Badge>
                              </div>

                              {/* Middle: Transaction Details */}
                              <div className="flex-1 space-y-4">
                                {/* Property Info */}
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <FileText className="h-5 w-5 text-purple-600" />
                                    <h3 className="text-xl font-semibold">
                                      {transaction.propertyTitle}
                                    </h3>
                                  </div>
                                  <code className="text-sm bg-gray-100 px-3 py-1 rounded">
                                    {transaction.propertyUid}
                                  </code>
                                </div>

                                {/* Transfer Info */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                      <User className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Seller</p>
                                      <p className="font-medium">{transaction.sellerName}</p>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-center">
                                    <ArrowRight className="h-5 w-5 text-gray-400" />
                                  </div>

                                  <div className="flex items-start gap-3">
                                    <div className="p-2 bg-green-50 rounded-lg">
                                      <User className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Buyer</p>
                                      <p className="font-medium">{transaction.buyerName}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Additional Info */}
                                <div className="flex flex-wrap gap-4 text-sm">
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-green-600" />
                                    <span className="font-semibold text-green-600">
                                      ${transaction.amount.toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                      {new Date(transaction.initiatedAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  {transaction.completedAt && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                                      <span>
                                        Completed: {new Date(transaction.completedAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {transaction.notes && (
                                  <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-sm text-gray-600">
                                      <strong>Notes:</strong> {transaction.notes}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Right: Actions */}
                              {user?.role === 'INSPECTOR' &&
                                (transaction.status === 'INITIATED' ||
                                  transaction.status === 'UNDER_REVIEW') && (
                                  <div className="flex lg:flex-col gap-2">
                                    <Button
                                      onClick={() => handleApprove(transaction)}
                                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                    >
                                      <CheckCircle2 className="mr-2 h-4 w-4" />
                                      Review
                                    </Button>
                                  </div>
                                )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <div className="p-6 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <FileText className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl mb-2">No Transactions</h3>
                  <p className="text-gray-500">
                    {activeTab === 'all'
                      ? 'No transactions have been initiated yet'
                      : `No ${activeTab.toLowerCase()} transactions`}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Approve Dialog */}
      {selectedTransaction && (
        <ApproveTransactionDialog
          transaction={selectedTransaction}
          open={showApproveDialog}
          onClose={() => {
            setShowApproveDialog(false);
            setSelectedTransaction(null);
          }}
          onApproved={handleTransactionApproved}
        />
      )}
    </div>
  );
}
