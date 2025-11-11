// Advanced Blockchain Utilities with Cryptographic Functions

import { Block } from '../types';

/**
 * Calculate SHA-256 hash using Web Crypto API
 */
export async function calculateSHA256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Mine a block with proof-of-work
 */
export async function mineBlock(
  blockData: Omit<Block, 'currentHash' | 'nonce'>,
  difficulty: number = 4
): Promise<Block> {
  let nonce = 0;
  const target = '0'.repeat(difficulty);
  
  while (true) {
    const blockWithNonce = { ...blockData, nonce };
    const hash = await calculateBlockHash(blockWithNonce);
    
    if (hash.startsWith(target)) {
      return { ...blockWithNonce, currentHash: hash };
    }
    
    nonce++;
    
    // Prevent blocking the UI thread
    if (nonce % 1000 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
}

/**
 * Calculate block hash
 */
export async function calculateBlockHash(
  block: Omit<Block, 'currentHash'>
): Promise<string> {
  const blockString = JSON.stringify({
    blockIndex: block.blockIndex,
    timestamp: block.timestamp,
    transactionData: block.transactionData,
    previousHash: block.previousHash,
    nonce: block.nonce,
  });
  
  return await calculateSHA256(blockString);
}

/**
 * Verify block integrity
 */
export async function verifyBlock(block: Block): Promise<boolean> {
  const calculatedHash = await calculateBlockHash(block);
  return calculatedHash === block.currentHash;
}

/**
 * Verify blockchain integrity
 */
export async function verifyBlockchain(blocks: Block[]): Promise<{
  isValid: boolean;
  tamperedBlocks: number[];
  invalidHashes: number[];
}> {
  const tamperedBlocks: number[] = [];
  const invalidHashes: number[] = [];
  
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    
    // Verify block's own hash
    const isHashValid = await verifyBlock(block);
    if (!isHashValid) {
      invalidHashes.push(i);
    }
    
    // Verify chain link (except genesis block)
    if (i > 0) {
      const previousBlock = blocks[i - 1];
      if (block.previousHash !== previousBlock.currentHash) {
        tamperedBlocks.push(i);
      }
    }
  }
  
  return {
    isValid: tamperedBlocks.length === 0 && invalidHashes.length === 0,
    tamperedBlocks,
    invalidHashes,
  };
}

/**
 * Create genesis block
 */
export async function createGenesisBlock(): Promise<Block> {
  const genesisBlock: Omit<Block, 'currentHash' | 'nonce'> = {
    id: 'genesis',
    blockIndex: 0,
    timestamp: new Date('2024-01-01T00:00:00Z').toISOString(),
    transactionData: {
      transactionId: 'genesis',
      propertyId: 'genesis',
      propertyUid: 'GENESIS',
      fromOwner: 'System',
      toOwner: 'System',
      amount: 0,
    },
    previousHash: '0'.repeat(64),
  };
  
  return await mineBlock(genesisBlock, 4);
}

/**
 * Create new block from transaction
 */
export async function createBlockFromTransaction(
  previousBlock: Block,
  transactionData: Block['transactionData'],
  difficulty: number = 4
): Promise<Block> {
  const newBlock: Omit<Block, 'currentHash' | 'nonce'> = {
    id: crypto.randomUUID(),
    blockIndex: previousBlock.blockIndex + 1,
    timestamp: new Date().toISOString(),
    transactionData,
    previousHash: previousBlock.currentHash,
  };
  
  return await mineBlock(newBlock, difficulty);
}

/**
 * Calculate merkle root from transactions
 */
export async function calculateMerkleRoot(transactions: string[]): Promise<string> {
  if (transactions.length === 0) return '';
  if (transactions.length === 1) return await calculateSHA256(transactions[0]);
  
  const hashes = await Promise.all(
    transactions.map(tx => calculateSHA256(tx))
  );
  
  while (hashes.length > 1) {
    const newLevel: string[] = [];
    
    for (let i = 0; i < hashes.length; i += 2) {
      if (i + 1 < hashes.length) {
        const combined = hashes[i] + hashes[i + 1];
        newLevel.push(await calculateSHA256(combined));
      } else {
        newLevel.push(hashes[i]);
      }
    }
    
    hashes.length = 0;
    hashes.push(...newLevel);
  }
  
  return hashes[0];
}

/**
 * Format hash for display
 */
export function formatHash(hash: string, length: number = 16): string {
  if (hash.length <= length) return hash;
  const half = Math.floor(length / 2) - 2;
  return `${hash.substring(0, half)}...${hash.substring(hash.length - half)}`;
}

/**
 * Get difficulty color
 */
export function getDifficultyColor(difficulty: number): string {
  if (difficulty <= 2) return 'text-green-600';
  if (difficulty <= 4) return 'text-yellow-600';
  if (difficulty <= 6) return 'text-orange-600';
  return 'text-red-600';
}

/**
 * Estimate mining time
 */
export function estimateMiningTime(difficulty: number): string {
  const baseTime = Math.pow(16, difficulty) / 1000000; // Rough estimate
  
  if (baseTime < 1) return '< 1 second';
  if (baseTime < 60) return `~${Math.round(baseTime)} seconds`;
  if (baseTime < 3600) return `~${Math.round(baseTime / 60)} minutes`;
  return `~${Math.round(baseTime / 3600)} hours`;
}
