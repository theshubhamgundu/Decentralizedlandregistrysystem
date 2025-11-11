import React, { useState, useEffect } from 'react';
import { Block, ChainVerificationResult } from '../types';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Blocks, Link2, Hash, Clock, CheckCircle2, AlertTriangle, 
  Loader2, Shield, Zap, Activity, Database, ArrowRight,
  ChevronDown, ChevronUp, Sparkles, Lock
} from 'lucide-react';
import { blockAPI } from '../lib/api';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import { formatHash, getHashColor } from '../utils/blockchain';

interface EnhancedBlockchainViewerProps {
  blocks: Block[];
  onRefresh: () => void;
}

export function EnhancedBlockchainViewer({ blocks, onRefresh }: EnhancedBlockchainViewerProps) {
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<ChainVerificationResult | null>(null);
  const [expandedBlock, setExpandedBlock] = useState<string | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [viewMode, setViewMode] = useState<'chain' | 'grid'>('chain');
  const [verificationProgress, setVerificationProgress] = useState(0);

  const handleVerify = async () => {
    setVerifying(true);
    setVerificationProgress(0);
    
    try {
      // Simulate progressive verification
      const totalBlocks = blocks.length;
      for (let i = 0; i <= totalBlocks; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setVerificationProgress((i / totalBlocks) * 100);
      }
      
      const result = await blockAPI.verify();
      setVerificationResult(result);
      
      if (result.isValid) {
        toast.success('🎉 Blockchain verified successfully!', {
          description: `All ${result.totalBlocks} blocks are valid and tamper-proof.`
        });
      } else {
        toast.error('⚠️ Blockchain verification failed!', {
          description: `Found ${result.tamperedBlocks?.length || 0} compromised block(s).`
        });
      }
    } catch (error) {
      toast.error('Failed to verify blockchain');
      console.error(error);
    } finally {
      setVerifying(false);
      setVerificationProgress(0);
    }
  };

  const getBlockStatus = (block: Block) => {
    const isTampered = verificationResult?.tamperedBlocks?.includes(block.blockIndex) || false;
    const isGenesis = block.blockIndex === 0;
    return { isTampered, isGenesis };
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 text-white"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Database className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl mb-1">Blockchain Ledger</h1>
                  <p className="text-blue-100">Immutable Property Ownership Records</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Blocks className="h-4 w-4" />
                    <span className="text-sm opacity-90">Total Blocks</span>
                  </div>
                  <p className="text-2xl">{blocks.length}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm opacity-90">Chain Status</span>
                  </div>
                  <p className="text-2xl">{verificationResult?.isValid ? '✓' : '?'}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="h-4 w-4" />
                    <span className="text-sm opacity-90">Transactions</span>
                  </div>
                  <p className="text-2xl">{blocks.length > 0 ? blocks.length - 1 : 0}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Lock className="h-4 w-4" />
                    <span className="text-sm opacity-90">Security</span>
                  </div>
                  <p className="text-2xl">SHA-256</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button 
              onClick={handleVerify} 
              disabled={verifying}
              className="bg-white text-purple-600 hover:bg-white/90"
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
            <Button 
              variant="outline" 
              onClick={onRefresh}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Refresh Data
            </Button>
          </div>

          {verifying && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4"
            >
              <Progress value={verificationProgress} className="h-2 bg-white/20" />
              <p className="text-sm mt-2 text-blue-100">
                Verifying block integrity... {Math.round(verificationProgress)}%
              </p>
            </motion.div>
          )}
        </div>

        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              initial={{ 
                x: Math.random() * 100 + '%', 
                y: Math.random() * 100 + '%' 
              }}
              animate={{
                y: [null, Math.random() * -100 + '%'],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Verification Result */}
      <AnimatePresence>
        {verificationResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Alert 
              variant={verificationResult.isValid ? 'default' : 'destructive'}
              className="border-2"
            >
              <div className="flex items-start gap-3">
                {verificationResult.isValid ? (
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                ) : (
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                )}
                <div className="flex-1">
                  <AlertDescription>
                    <p className="font-semibold mb-2">{verificationResult.message}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span>
                        ✓ Verified: <strong>{verificationResult.verifiedBlocks}</strong> blocks
                      </span>
                      <span>
                        Total: <strong>{verificationResult.totalBlocks}</strong> blocks
                      </span>
                      {verificationResult.tamperedBlocks && verificationResult.tamperedBlocks.length > 0 && (
                        <span className="text-red-600">
                          ⚠ Tampered: <strong>{verificationResult.tamperedBlocks.join(', ')}</strong>
                        </span>
                      )}
                    </div>
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Mode Toggle */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="chain">
            <Link2 className="h-4 w-4 mr-2" />
            Chain View
          </TabsTrigger>
          <TabsTrigger value="grid">
            <Blocks className="h-4 w-4 mr-2" />
            Grid View
          </TabsTrigger>
        </TabsList>

        {/* Chain View */}
        <TabsContent value="chain" className="space-y-0 mt-6">
          <AnimatePresence mode="popLayout">
            {blocks.map((block, index) => {
              const { isTampered, isGenesis } = getBlockStatus(block);
              const isExpanded = expandedBlock === block.id;
              const hashColor = getHashColor(block.currentHash);

              return (
                <motion.div
                  key={block.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                      isTampered 
                        ? 'border-2 border-red-500 bg-red-50/50' 
                        : 'border hover:border-purple-300'
                    } ${isExpanded ? 'shadow-2xl scale-[1.02]' : ''}`}
                    onClick={() => setExpandedBlock(isExpanded ? null : block.id)}
                  >
                    <div className="p-6">
                      {/* Block Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 bg-gradient-to-br ${hashColor} rounded-xl shadow-lg`}>
                            <Blocks className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-xl">Block #{block.blockIndex}</h3>
                              {isGenesis && (
                                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                  <Sparkles className="h-3 w-3 mr-1" />
                                  Genesis
                                </Badge>
                              )}
                              {isTampered && (
                                <Badge variant="destructive">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Tampered
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                              <Clock className="h-3 w-3" />
                              {new Date(block.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        
                        <Button variant="ghost" size="sm">
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      {/* Hash Preview */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                            <Hash className="h-4 w-4" />
                            <span>Current Hash</span>
                          </div>
                          <code className="text-xs font-mono bg-white px-3 py-2 rounded block break-all border">
                            {block.currentHash}
                          </code>
                        </div>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                            <Link2 className="h-4 w-4" />
                            <span>Previous Hash</span>
                          </div>
                          <code className="text-xs font-mono bg-white px-3 py-2 rounded block break-all border">
                            {block.previousHash}
                          </code>
                        </div>
                      </div>

                      {/* Transaction Preview */}
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              <Activity className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium">{block.transactionData.propertyUid}</p>
                              <p className="text-sm text-gray-600">
                                {block.transactionData.fromOwner} 
                                <ArrowRight className="inline h-3 w-3 mx-1" />
                                {block.transactionData.toOwner}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-green-600">
                              ${block.transactionData.amount.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">Transfer Amount</p>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 pt-4 border-t space-y-4"
                          >
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="bg-white rounded-lg p-3 border">
                                <p className="text-xs text-gray-500 mb-1">Block Index</p>
                                <p className="font-semibold">{block.blockIndex}</p>
                              </div>
                              <div className="bg-white rounded-lg p-3 border">
                                <p className="text-xs text-gray-500 mb-1">Nonce</p>
                                <p className="font-semibold">{block.nonce}</p>
                              </div>
                              <div className="bg-white rounded-lg p-3 border">
                                <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
                                <p className="font-semibold text-xs truncate">
                                  {block.transactionData.transactionId}
                                </p>
                              </div>
                              <div className="bg-white rounded-lg p-3 border">
                                <p className="text-xs text-gray-500 mb-1">Property ID</p>
                                <p className="font-semibold text-xs truncate">
                                  {block.transactionData.propertyId}
                                </p>
                              </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                              <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <Zap className="h-4 w-4 text-yellow-600" />
                                Full Transaction Data
                              </h4>
                              <pre className="text-xs bg-white p-4 rounded border overflow-auto max-h-48">
                                {JSON.stringify(block.transactionData, null, 2)}
                              </pre>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Card>

                  {/* Chain Link Connector */}
                  {index < blocks.length - 1 && (
                    <div className="flex justify-center my-3">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center"
                      >
                        <motion.div 
                          className="w-1 h-6 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full"
                          animate={{ scaleY: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <div className="p-2 bg-purple-100 rounded-full">
                          <Link2 className="h-4 w-4 text-purple-600" />
                        </div>
                        <motion.div 
                          className="w-1 h-6 bg-gradient-to-b from-purple-600 to-purple-400 rounded-full"
                          animate={{ scaleY: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                        />
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </TabsContent>

        {/* Grid View */}
        <TabsContent value="grid" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blocks.map((block, index) => {
              const { isTampered, isGenesis } = getBlockStatus(block);
              const hashColor = getHashColor(block.currentHash);

              return (
                <motion.div
                  key={block.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={`cursor-pointer transition-all hover:shadow-xl hover:scale-105 ${
                      isTampered ? 'border-2 border-red-500' : ''
                    }`}
                    onClick={() => setSelectedBlock(block)}
                  >
                    <div className="p-5">
                      <div className={`p-4 bg-gradient-to-br ${hashColor} rounded-xl mb-4`}>
                        <div className="flex items-center justify-between text-white">
                          <Blocks className="h-6 w-6" />
                          <span className="text-xl">#{block.blockIndex}</span>
                        </div>
                      </div>
                      
                      {isGenesis && (
                        <Badge className="mb-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          Genesis Block
                        </Badge>
                      )}

                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-500">Hash:</span>
                          <code className="block text-xs mt-1 truncate">
                            {formatHash(block.currentHash)}
                          </code>
                        </div>
                        <div>
                          <span className="text-gray-500">Property:</span>
                          <p className="font-medium">{block.transactionData.propertyUid}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Amount:</span>
                          <p className="font-semibold text-green-600">
                            ${block.transactionData.amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Empty State */}
      {blocks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="p-6 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <Database className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl mb-2">No Blocks Yet</h3>
          <p className="text-gray-500">The blockchain is empty. Complete a transaction to create the first block.</p>
        </motion.div>
      )}
    </div>
  );
}
