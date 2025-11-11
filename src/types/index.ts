// User and Authentication Types
export type UserRole = 'ADMIN' | 'INSPECTOR' | 'SELLER' | 'BUYER';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  fullName: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Property Types
export type PropertyStatus = 'REGISTERED' | 'FOR_SALE' | 'SOLD' | 'UNDER_REVIEW';

export interface Property {
  id: string;
  propertyUid: string;
  title: string;
  address: string;
  area: number; // in square meters
  description: string;
  status: PropertyStatus;
  price?: number;
  ownerId: string;
  ownerName: string;
  registeredAt: string;
  documents: PropertyDocument[];
}

export interface PropertyDocument {
  id: string;
  fileName: string;
  filePath: string;
  checksum: string;
  uploadedAt: string;
}

// Transaction Types
export type TransactionStatus = 'INITIATED' | 'UNDER_REVIEW' | 'APPROVED' | 'COMPLETED' | 'REJECTED';

export interface Transaction {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyUid: string;
  sellerId: string;
  sellerName: string;
  buyerId: string;
  buyerName: string;
  amount: number;
  status: TransactionStatus;
  initiatedAt: string;
  completedAt?: string;
  inspectorId?: string;
  inspectorName?: string;
  notes?: string;
}

// Blockchain/Ledger Types
export interface Block {
  id: string;
  blockIndex: number;
  timestamp: string;
  transactionData: {
    transactionId: string;
    propertyId: string;
    propertyUid: string;
    fromOwner: string;
    toOwner: string;
    amount: number;
  };
  previousHash: string;
  currentHash: string;
  nonce: number;
}

export interface ChainVerificationResult {
  isValid: boolean;
  totalBlocks: number;
  verifiedBlocks: number;
  tamperedBlocks?: number[];
  message: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalProperties: number;
  totalTransactions: number;
  pendingTransactions: number;
  totalBlocks: number;
  lastVerification?: string;
  chainValid?: boolean;
}
