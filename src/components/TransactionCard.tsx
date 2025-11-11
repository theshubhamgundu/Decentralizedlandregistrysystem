import React from 'react';
import { Transaction } from '../types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Building2, User, Calendar, DollarSign } from 'lucide-react';

interface TransactionCardProps {
  transaction: Transaction;
  onView?: (transaction: Transaction) => void;
  actionButtons?: React.ReactNode;
}

export function TransactionCard({ transaction, onView, actionButtons }: TransactionCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'UNDER_REVIEW':
        return 'bg-yellow-100 text-yellow-800';
      case 'INITIATED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{transaction.propertyTitle}</CardTitle>
            <p className="text-xs text-gray-500 mt-1">{transaction.propertyUid}</p>
          </div>
          <Badge className={getStatusColor(transaction.status)}>
            {transaction.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex items-center space-x-2 text-gray-500 mb-1">
              <User className="h-4 w-4" />
              <span>Seller</span>
            </div>
            <p>{transaction.sellerName}</p>
          </div>

          <div>
            <div className="flex items-center space-x-2 text-gray-500 mb-1">
              <User className="h-4 w-4" />
              <span>Buyer</span>
            </div>
            <p>{transaction.buyerName}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>{new Date(transaction.initiatedAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <span className="text-lg text-blue-600">
              {transaction.amount.toLocaleString()}
            </span>
          </div>
        </div>

        {transaction.inspectorName && (
          <div className="text-xs text-gray-500 pt-2 border-t">
            Inspector: {transaction.inspectorName}
          </div>
        )}
      </CardContent>

      {(onView || actionButtons) && (
        <CardFooter className="flex space-x-2">
          {onView && (
            <Button variant="outline" className="flex-1" onClick={() => onView(transaction)}>
              View Details
            </Button>
          )}
          {actionButtons}
        </CardFooter>
      )}
    </Card>
  );
}
