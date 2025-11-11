import React, { useState, useEffect } from 'react';
import { Block } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import {
  Blocks,
  Link2,
  Hash,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Activity,
  Shield,
  Zap,
  Eye,
  Lock,
  Database,
  GitBranch,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { verifyBlockchain, formatHash, getDifficultyColor } from '../utils/blockchain';

interface AdvancedBlockchainViewerProps {
  blocks: Block[];
  onRefresh: () => void;
}

export function AdvancedBlockchainViewer({ blocks, onRefresh }: AdvancedBlockchainViewerProps) {
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    tamperedBlocks: number[];
    invalidHashes: number[];
  } | null>(null);
  const [expandedBlock, setExpandedBlock] = useState<string | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [viewMode, setViewMode] = useState<'chain' | 'grid'>('chain');
  const [verificationProgress, setVerificationProgress] = useState(0);

  const handleVerify = async () => {
    setVerifying(true);
    setVerificationProgress(0);
    
    try {
      // Simulate progressive verification
      const progressInterval = setInterval(() => {
        setVerificationProgress(prev => Math.min(prev + 10, 90));
      }, 100);
      
      const result = await verifyBlockchain(blocks);
      
      clearInterval(progressInterval);
      setVerificationProgress(100);
      setVerificationResult(result);
      
      setTimeout(() => setVerificationProgress(0), 2000);
    } catch (error) {
      console.error('Verification error:', error);
    } finally {
      setVerifying(false);
    }
  };

  const getBlockStatus = (block: Block) => {
    if (!verificationResult) return 'unknown';
    
    if (verificationResult.invalidHashes.includes(block.blockIndex)) {
      return 'invalid-hash';
    }
    if (verificationResult.tamperedBlocks.includes(block.blockIndex)) {
      return 'tampered';
    }
    return 'valid';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50';
      case 'invalid-hash':
        return 'border-red-500 bg-gradient-to-br from-red-50 to-rose-50';
      case 'tampered':
        return 'border-orange-500 bg-gradient-to-br from-orange-50 to-amber-50';
      default:
        return 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50';
    }
  };

  const BlockCard = ({ block, index }: { block: Block; index: number }) => {
    const isExpanded = expandedBlock === block.id;
    const status = getBlockStatus(block);
    const statusColor = getStatusColor(status);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Card
          className={`cursor-pointer transition-all hover:shadow-lg ${statusColor} border-2`}
          onClick={() => {
            setExpandedBlock(isExpanded ? null : block.id);
            setSelectedBlock(block);
          }}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.div
                  className="p-3 bg-white rounded-xl shadow-sm"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {block.blockIndex === 0 ? (
                    <Shield className="h-6 w-6 text-purple-600" />
                  ) : (
                    <Blocks className="h-6 w-6 text-blue-600" />
                  )}
                </motion.div>
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>Block #{block.blockIndex}</span>
                    {block.blockIndex === 0 && (
                      <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                        Genesis
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(block.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {status === 'valid' && verificationResult && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </motion.div>
                )}
                {status === 'invalid-hash' && (
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                  >
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </motion.div>
                )}
                {status === 'tampered' && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                  </motion.div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Hash Display */}
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2 text-gray-600 mb-2">
                  <Hash className="h-4 w-4" />
                  <span className="font-semibold">Current Hash</span>
                </div>
                <code className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 rounded block break-all border border-blue-200">
                  {block.currentHash}
                </code>
              </div>
              
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2 text-gray-600 mb-2">
                  <Link2 className="h-4 w-4" />
                  <span className="font-semibold">Previous Hash</span>
                </div>
                <code className="text-xs bg-gradient-to-r from-gray-50 to-slate-50 px-3 py-2 rounded block break-all border border-gray-200">
                  {block.previousHash}
                </code>
              </div>
            </div>

            {/* Transaction Info */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Separator className="my-4" />
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-gray-700">
                      <Database className="h-4 w-4" />
                      <h4 className="font-semibold">Transaction Data</h4>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg space-y-3 text-sm shadow-sm border border-gray-100">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Transaction ID</p>
                          <p className="font-mono text-xs bg-gray-50 p-2 rounded border">
                            {formatHash(block.transactionData.transactionId, 20)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Property UID</p>
                          <p className="font-mono text-xs bg-gray-50 p-2 rounded border">
                            {block.transactionData.propertyUid}
                          </p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
                        <div>
                          <p className="text-gray-600 text-xs mb-1">From</p>
                          <p className="font-semibold">{block.transactionData.fromOwner}</p>
                        </div>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <GitBranch className="h-5 w-5 text-blue-600" />
                        </motion.div>
                        <div>
                          <p className="text-gray-600 text-xs mb-1">To</p>
                          <p className="font-semibold">{block.transactionData.toOwner}</p>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
                        <p className="text-gray-600 text-xs mb-1">Amount</p>
                        <p className="text-2xl font-bold text-green-700">
                          ${block.transactionData.amount.toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 p-2 rounded border">
                          <p className="text-gray-500 text-xs mb-1">Nonce</p>
                          <p className="font-mono">{block.nonce}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded border">
                          <p className="text-gray-500 text-xs mb-1">Block Size</p>
                          <p className="font-mono">
                            {(JSON.stringify(block).length / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold flex items-center space-x-3">
              <Lock className="h-8 w-8" />
              <span>Blockchain Ledger</span>
            </h2>
            <p className="text-blue-100 mt-2">
              Immutable land ownership records secured by cryptographic hashing
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{blocks.length}</div>
            <div className="text-blue-200 text-sm">Total Blocks</div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 mb-1">Chain Height</p>
                <p className="text-2xl font-bold text-purple-900">
                  {blocks.length > 0 ? blocks[blocks.length - 1].blockIndex + 1 : 0}
                </p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 mb-1">Verified Blocks</p>
                <p className="text-2xl font-bold text-green-900">
                  {verificationResult
                    ? blocks.length - verificationResult.tamperedBlocks.length - verificationResult.invalidHashes.length
                    : '-'}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 mb-1">Chain Size</p>
                <p className="text-2xl font-bold text-blue-900">
                  {(JSON.stringify(blocks).length / 1024).toFixed(1)} KB
                </p>
              </div>
              <Database className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 mb-1">Difficulty</p>
                <p className="text-2xl font-bold text-orange-900">4</p>
              </div>
              <Zap className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Button
            onClick={handleVerify}
            disabled={verifying}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {verifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Verify Chain Integrity
              </>
            )}
          </Button>
          <Button variant="outline" onClick={onRefresh}>
            <Activity className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'chain' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('chain')}
          >
            <Link2 className="mr-2 h-4 w-4" />
            Chain View
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Blocks className="mr-2 h-4 w-4" />
            Grid View
          </Button>
        </div>
      </div>

      {/* Verification Progress */}
      {verifying && verificationProgress > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-700 font-semibold">Verifying blockchain integrity...</span>
                  <span className="text-blue-600">{verificationProgress}%</span>
                </div>
                <Progress value={verificationProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Verification Result */}
      {verificationResult && !verifying && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <Alert
            variant={verificationResult.isValid ? 'default' : 'destructive'}
            className={
              verificationResult.isValid
                ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50'
                : 'border-red-500 bg-gradient-to-r from-red-50 to-rose-50'
            }
          >
            <div className="flex items-center">
              {verificationResult.isValid ? (
                <CheckCircle2 className="h-5 w-5 mr-3 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 mr-3 text-red-600" />
              )}
              <AlertDescription>
                <strong className="text-lg">
                  {verificationResult.isValid
                    ? '✓ Blockchain Verified Successfully'
                    : '✗ Blockchain Integrity Compromised'}
                </strong>
                <div className="text-sm mt-2 space-y-1">
                  <p>
                    Verified {blocks.length - verificationResult.tamperedBlocks.length - verificationResult.invalidHashes.length} of{' '}
                    {blocks.length} blocks
                  </p>
                  {verificationResult.tamperedBlocks.length > 0 && (
                    <p className="text-red-700">
                      <strong>Tampered blocks:</strong> {verificationResult.tamperedBlocks.join(', ')}
                    </p>
                  )}
                  {verificationResult.invalidHashes.length > 0 && (
                    <p className="text-red-700">
                      <strong>Invalid hashes:</strong> {verificationResult.invalidHashes.join(', ')}
                    </p>
                  )}
                </div>
              </AlertDescription>
            </div>
          </Alert>
        </motion.div>
      )}

      {/* Blockchain Visualization */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
        {blocks.map((block, index) => (
          <div key={block.id}>
            <BlockCard block={block} index={index} />
            
            {/* Chain Link Visualization (only in chain view) */}
            {viewMode === 'chain' && index < blocks.length - 1 && (
              <motion.div
                className="flex justify-center my-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 + 0.2 }}
              >
                <div className="flex flex-col items-center">
                  <motion.div
                    className="w-1 h-6 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"
                    animate={{ scaleY: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2, delay: index * 0.1 }}
                  />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                  >
                    <Link2 className="h-6 w-6 text-blue-600 my-1" />
                  </motion.div>
                  <motion.div
                    className="w-1 h-6 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"
                    animate={{ scaleY: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2, delay: index * 0.1 + 1 }}
                  />
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {blocks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Blocks className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No blocks in the chain yet</p>
          <p className="text-gray-400 text-sm mt-2">Start by creating transactions to build the blockchain</p>
        </motion.div>
      )}
    </div>
  );
}
