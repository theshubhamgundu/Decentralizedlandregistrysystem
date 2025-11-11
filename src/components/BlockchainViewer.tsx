import React, { useState } from 'react';
import { Block, ChainVerificationResult } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Blocks, Link2, Hash, Clock, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { blockAPI } from '../lib/api';
import { toast } from 'sonner@2.0.3';

interface BlockchainViewerProps {
  blocks: Block[];
  onRefresh: () => void;
}

export function BlockchainViewer({ blocks, onRefresh }: BlockchainViewerProps) {
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<ChainVerificationResult | null>(
    null
  );
  const [expandedBlock, setExpandedBlock] = useState<string | null>(null);

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const result = await blockAPI.verify();
      setVerificationResult(result);
      
      if (result.isValid) {
        toast.success('Blockchain verified successfully!');
      } else {
        toast.error('Blockchain verification failed!');
      }
    } catch (error) {
      toast.error('Failed to verify blockchain');
      console.error(error);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Verification */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">Blockchain Ledger</h2>
          <p className="text-sm text-gray-500 mt-1">
            Total Blocks: {blocks.length}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onRefresh}>
            Refresh
          </Button>
          <Button onClick={handleVerify} disabled={verifying}>
            {verifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify Chain
          </Button>
        </div>
      </div>

      {/* Verification Result */}
      {verificationResult && (
        <Alert variant={verificationResult.isValid ? 'default' : 'destructive'}>
          <div className="flex items-center">
            {verificationResult.isValid ? (
              <CheckCircle2 className="h-4 w-4 mr-2" />
            ) : (
              <AlertTriangle className="h-4 w-4 mr-2" />
            )}
            <AlertDescription>
              <strong>{verificationResult.message}</strong>
              <div className="text-sm mt-1">
                Verified {verificationResult.verifiedBlocks} of {verificationResult.totalBlocks}{' '}
                blocks
                {verificationResult.tamperedBlocks && (
                  <span className="ml-2">
                    | Tampered blocks: {verificationResult.tamperedBlocks.join(', ')}
                  </span>
                )}
              </div>
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Blockchain Visualization */}
      <div className="space-y-4">
        {blocks.map((block, index) => {
          const isExpanded = expandedBlock === block.id;
          const isTampered =
            verificationResult?.tamperedBlocks?.includes(block.blockIndex) || false;

          return (
            <div key={block.id}>
              <Card
                className={`cursor-pointer transition-all ${
                  isTampered ? 'border-red-500 bg-red-50' : ''
                }`}
                onClick={() => setExpandedBlock(isExpanded ? null : block.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Blocks className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Block #{block.blockIndex}</CardTitle>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(block.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isTampered && (
                        <Badge variant="destructive">Tampered</Badge>
                      )}
                      {block.blockIndex === 0 && (
                        <Badge className="bg-purple-100 text-purple-800">Genesis</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Hash Preview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="flex items-center space-x-2 text-gray-500 mb-1">
                        <Hash className="h-4 w-4" />
                        <span>Current Hash</span>
                      </div>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded block truncate">
                        {block.currentHash}
                      </code>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 text-gray-500 mb-1">
                        <Link2 className="h-4 w-4" />
                        <span>Previous Hash</span>
                      </div>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded block truncate">
                        {block.previousHash}
                      </code>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <h4 className="font-semibold">Transaction Data</h4>
                        <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-gray-500">Transaction ID</p>
                              <p className="truncate">{block.transactionData.transactionId}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Property UID</p>
                              <p>{block.transactionData.propertyUid}</p>
                            </div>
                          </div>
                          <Separator />
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-gray-500">From Owner</p>
                              <p>{block.transactionData.fromOwner}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">To Owner</p>
                              <p>{block.transactionData.toOwner}</p>
                            </div>
                          </div>
                          <Separator />
                          <div>
                            <p className="text-gray-500">Amount</p>
                            <p className="text-lg text-blue-600">
                              ${block.transactionData.amount.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Nonce</p>
                            <p>{block.nonce}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Chain Link Visualization */}
              {index < blocks.length - 1 && (
                <div className="flex justify-center my-2">
                  <div className="flex flex-col items-center">
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-blue-600"></div>
                    <Link2 className="h-5 w-5 text-blue-600" />
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-400"></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {blocks.length === 0 && (
        <div className="text-center py-12">
          <Blocks className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No blocks in the chain yet</p>
        </div>
      )}
    </div>
  );
}
