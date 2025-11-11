// Advanced Blockchain Utilities with Real Cryptography

/**
 * Calculate SHA-256 hash using Web Crypto API
 */
export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Calculate block hash with all data
 */
export async function calculateBlockHash(
  blockIndex: number,
  timestamp: string,
  data: any,
  previousHash: string,
  nonce: number
): Promise<string> {
  const blockData = `${blockIndex}${timestamp}${JSON.stringify(data)}${previousHash}${nonce}`;
  return await sha256(blockData);
}

/**
 * Mine a block with proof of work (find hash with leading zeros)
 */
export async function mineBlock(
  blockIndex: number,
  timestamp: string,
  data: any,
  previousHash: string,
  difficulty: number = 4
): Promise<{ hash: string; nonce: number }> {
  let nonce = 0;
  let hash = '';
  const target = '0'.repeat(difficulty);

  while (!hash.startsWith(target)) {
    nonce++;
    hash = await calculateBlockHash(blockIndex, timestamp, data, previousHash, nonce);
  }

  return { hash, nonce };
}

/**
 * Verify if a hash meets the difficulty requirement
 */
export function isHashValid(hash: string, difficulty: number): boolean {
  const target = '0'.repeat(difficulty);
  return hash.startsWith(target);
}

/**
 * Format hash for display (truncate middle)
 */
export function formatHash(hash: string, length: number = 16): string {
  if (hash.length <= length) return hash;
  const start = hash.slice(0, length / 2);
  const end = hash.slice(-length / 2);
  return `${start}...${end}`;
}

/**
 * Get hash color based on content (for visualization)
 */
export function getHashColor(hash: string): string {
  const colors = [
    'from-blue-500 to-purple-600',
    'from-purple-500 to-pink-600',
    'from-pink-500 to-red-600',
    'from-green-500 to-blue-600',
    'from-cyan-500 to-blue-600',
    'from-indigo-500 to-purple-600',
  ];
  
  const index = parseInt(hash.slice(0, 2), 16) % colors.length;
  return colors[index];
}

/**
 * Validate blockchain integrity
 */
export async function validateChain(blocks: any[]): Promise<{
  isValid: boolean;
  invalidBlocks: number[];
  errors: string[];
}> {
  const invalidBlocks: number[] = [];
  const errors: string[] = [];

  for (let i = 1; i < blocks.length; i++) {
    const currentBlock = blocks[i];
    const previousBlock = blocks[i - 1];

    // Check if previous hash matches
    if (currentBlock.previousHash !== previousBlock.currentHash) {
      invalidBlocks.push(i);
      errors.push(`Block ${i}: Previous hash mismatch`);
    }

    // Recalculate current block hash
    const calculatedHash = await calculateBlockHash(
      currentBlock.blockIndex,
      currentBlock.timestamp,
      currentBlock.transactionData,
      currentBlock.previousHash,
      currentBlock.nonce
    );

    if (calculatedHash !== currentBlock.currentHash) {
      invalidBlocks.push(i);
      errors.push(`Block ${i}: Hash integrity compromised`);
    }
  }

  return {
    isValid: invalidBlocks.length === 0,
    invalidBlocks,
    errors,
  };
}

/**
 * Calculate Merkle root for transactions
 */
export async function calculateMerkleRoot(transactions: any[]): Promise<string> {
  if (transactions.length === 0) return '';
  if (transactions.length === 1) {
    return await sha256(JSON.stringify(transactions[0]));
  }

  const hashes = await Promise.all(
    transactions.map(tx => sha256(JSON.stringify(tx)))
  );

  return await buildMerkleTree(hashes);
}

async function buildMerkleTree(hashes: string[]): Promise<string> {
  if (hashes.length === 1) return hashes[0];

  const newHashes: string[] = [];
  
  for (let i = 0; i < hashes.length; i += 2) {
    if (i + 1 < hashes.length) {
      const combined = hashes[i] + hashes[i + 1];
      newHashes.push(await sha256(combined));
    } else {
      newHashes.push(hashes[i]);
    }
  }

  return buildMerkleTree(newHashes);
}
