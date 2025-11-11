import React, { useEffect, useState } from 'react';
import { Block } from '../types';
import { blockAPI } from '../lib/api';
import { EnhancedBlockchainViewer } from '../components/EnhancedBlockchainViewer';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function Blockchain() {
  const [loading, setLoading] = useState(true);
  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    loadBlocks();
  }, []);

  const loadBlocks = async () => {
    setLoading(true);
    try {
      const data = await blockAPI.getAll();
      setBlocks(data);
    } catch (error) {
      console.error('Failed to load blocks:', error);
      toast.error('Failed to load blockchain data');
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

  return <EnhancedBlockchainViewer blocks={blocks} onRefresh={loadBlocks} />;
}