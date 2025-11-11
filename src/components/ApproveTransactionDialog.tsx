import React, { useState } from 'react';
import { Transaction } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { transactionAPI } from '../lib/api';
import { toast } from 'sonner@2.0.3';
import { Separator } from './ui/separator';

interface ApproveTransactionDialogProps {
  transaction: Transaction | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  inspectorId: string;
}

export function ApproveTransactionDialog({
  transaction,
  open,
  onClose,
  onSuccess,
  inspectorId,
}: ApproveTransactionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);

  if (!transaction) return null;

  const handleSubmit = async (approveAction: 'approve' | 'reject') => {
    setLoading(true);
    setAction(approveAction);

    try {
      if (approveAction === 'approve') {
        await transactionAPI.approve(transaction.id, inspectorId, notes);
        toast.success('Transaction approved and block created!');
      } else {
        await transactionAPI.reject(transaction.id, inspectorId, notes);
        toast.success('Transaction rejected');
      }

      onSuccess();
      onClose();
      setNotes('');
    } catch (error) {
      toast.error(`Failed to ${approveAction} transaction`);
      console.error(error);
    } finally {
      setLoading(false);
      setAction(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Review Transaction</DialogTitle>
          <DialogDescription>
            Review the transaction details and approve or reject the ownership transfer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Transaction Details */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div>
              <p className="text-sm text-gray-500">Property</p>
              <p>{transaction.propertyTitle}</p>
              <p className="text-xs text-gray-500">{transaction.propertyUid}</p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Seller</p>
                <p>{transaction.sellerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Buyer</p>
                <p>{transaction.buyerName}</p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-gray-500">Transaction Amount</p>
              <p className="text-2xl text-blue-600">
                ${transaction.amount.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Initiated</p>
              <p>{new Date(transaction.initiatedAt).toLocaleString()}</p>
            </div>
          </div>

          {/* Inspector Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Inspector Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add verification notes or comments..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-gray-500">
              These notes will be recorded in the transaction history.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => handleSubmit('reject')}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading && action === 'reject' && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {!loading && <XCircle className="mr-2 h-4 w-4" />}
            Reject
          </Button>
          <Button
            type="button"
            onClick={() => handleSubmit('approve')}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading && action === 'approve' && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {!loading && <CheckCircle2 className="mr-2 h-4 w-4" />}
            Approve & Create Block
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
