import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth-context';
import { Transaction } from '../types';
import { transactionAPI } from '../lib/api';
import { TransactionCard } from '../components/TransactionCard';
import { ApproveTransactionDialog } from '../components/ApproveTransactionDialog';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export function Transactions() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, statusFilter, activeTab, user]);

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

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Role-based filtering
    if (user?.role === 'BUYER') {
      if (activeTab === 'my-purchases') {
        filtered = filtered.filter((t) => t.buyerId === user.id);
      } else if (activeTab === 'all') {
        // Buyers can see all transactions for transparency
      }
    } else if (user?.role === 'SELLER') {
      if (activeTab === 'my-sales') {
        filtered = filtered.filter((t) => t.sellerId === user.id);
      }
    } else if (user?.role === 'INSPECTOR') {
      if (activeTab === 'pending') {
        filtered = filtered.filter(
          (t) => t.status === 'INITIATED' || t.status === 'UNDER_REVIEW'
        );
      }
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }

    setFilteredTransactions(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const getTabsForRole = () => {
    switch (user?.role) {
      case 'BUYER':
        return [
          { value: 'all', label: 'All Transactions' },
          { value: 'my-purchases', label: 'My Purchases' },
        ];
      case 'SELLER':
        return [
          { value: 'all', label: 'All Transactions' },
          { value: 'my-sales', label: 'My Sales' },
        ];
      case 'INSPECTOR':
        return [
          { value: 'pending', label: 'Pending Review' },
          { value: 'all', label: 'All Transactions' },
        ];
      default:
        return [{ value: 'all', label: 'All Transactions' }];
    }
  };

  const tabs = getTabsForRole();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl">Transactions</h1>
        <p className="text-gray-500 mt-1">
          {user?.role === 'BUYER' && 'Track your purchase requests and ownership transfers'}
          {user?.role === 'SELLER' && 'Monitor sales and property transfers'}
          {user?.role === 'INSPECTOR' && 'Review and approve pending transactions'}
          {user?.role === 'ADMIN' && 'Monitor all system transactions'}
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="INITIATED">Initiated</SelectItem>
              <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-6">
            {filteredTransactions.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredTransactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    actionButtons={
                      user?.role === 'INSPECTOR' &&
                      (transaction.status === 'INITIATED' ||
                        transaction.status === 'UNDER_REVIEW') ? (
                        <Button
                          className="flex-1"
                          onClick={() => setSelectedTransaction(transaction)}
                        >
                          Review
                        </Button>
                      ) : undefined
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">
                  {statusFilter !== 'all'
                    ? 'No transactions match your filter'
                    : activeTab === 'pending'
                    ? 'No pending transactions'
                    : activeTab === 'my-purchases'
                    ? 'You haven\'t made any purchases yet'
                    : activeTab === 'my-sales'
                    ? 'You don\'t have any sales yet'
                    : 'No transactions available'}
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Approve Transaction Dialog (Inspector only) */}
      {user?.role === 'INSPECTOR' && (
        <ApproveTransactionDialog
          transaction={selectedTransaction}
          open={!!selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onSuccess={loadTransactions}
          inspectorId={user.id}
        />
      )}
    </div>
  );
}
