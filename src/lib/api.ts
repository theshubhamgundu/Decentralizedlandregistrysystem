import {
  User,
  AuthResponse,
  Property,
  Transaction,
  Block,
  ChainVerificationResult,
  DashboardStats,
  UserRole,
} from '../types';

// Mock API Base URL - Replace with your Spring Boot backend URL
const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('dlrs_token');
};

// Helper function to make authenticated requests
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  return fetch(url, { ...options, headers });
}

// Auth API
export const authAPI = {
  async register(data: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
  }): Promise<AuthResponse> {
    // Mock implementation - replace with actual API call
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username: data.username,
      email: data.email,
      role: data.role,
      fullName: data.fullName,
      createdAt: new Date().toISOString(),
    };
    
    const mockToken = 'mock_jwt_token_' + mockUser.id;
    return { token: mockToken, user: mockUser };
  },

  async login(username: string, password: string): Promise<AuthResponse> {
    // Mock implementation - replace with actual API call
    const mockUser: User = {
      id: '1',
      username,
      email: `${username}@example.com`,
      role: 'BUYER', // Default role for demo
      fullName: username,
      createdAt: new Date().toISOString(),
    };
    
    const mockToken = 'mock_jwt_token_' + mockUser.id;
    return { token: mockToken, user: mockUser };
  },

  logout() {
    localStorage.removeItem('dlrs_token');
    localStorage.removeItem('dlrs_user');
  },
};

// Property API
export const propertyAPI = {
  async getAll(filters?: { status?: string; search?: string }): Promise<Property[]> {
    // Mock implementation
    return mockProperties;
  },

  async getById(id: string): Promise<Property> {
    const property = mockProperties.find(p => p.id === id);
    if (!property) throw new Error('Property not found');
    return property;
  },

  async create(data: Partial<Property>): Promise<Property> {
    // Mock implementation
    const newProperty: Property = {
      id: Math.random().toString(36).substr(2, 9),
      propertyUid: 'PROP-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      title: data.title || '',
      address: data.address || '',
      area: data.area || 0,
      description: data.description || '',
      status: 'REGISTERED',
      price: data.price,
      ownerId: '1',
      ownerName: 'Current User',
      registeredAt: new Date().toISOString(),
      documents: [],
    };
    mockProperties.push(newProperty);
    return newProperty;
  },

  async uploadDocument(propertyId: string, file: File): Promise<Property> {
    // Mock implementation
    const property = mockProperties.find(p => p.id === propertyId);
    if (!property) throw new Error('Property not found');
    
    const newDoc = {
      id: Math.random().toString(36).substr(2, 9),
      fileName: file.name,
      filePath: '/uploads/' + file.name,
      checksum: 'sha256_' + Math.random().toString(36).substr(2, 9),
      uploadedAt: new Date().toISOString(),
    };
    
    property.documents.push(newDoc);
    return property;
  },

  async updateStatus(propertyId: string, status: string): Promise<Property> {
    const property = mockProperties.find(p => p.id === propertyId);
    if (!property) throw new Error('Property not found');
    property.status = status as any;
    return property;
  },
};

// Transaction API
export const transactionAPI = {
  async getAll(filters?: { status?: string }): Promise<Transaction[]> {
    if (filters?.status) {
      return mockTransactions.filter(t => t.status === filters.status);
    }
    return mockTransactions;
  },

  async getById(id: string): Promise<Transaction> {
    const transaction = mockTransactions.find(t => t.id === id);
    if (!transaction) throw new Error('Transaction not found');
    return transaction;
  },

  async create(data: {
    propertyId: string;
    buyerId: string;
    amount: number;
  }): Promise<Transaction> {
    const property = mockProperties.find(p => p.id === data.propertyId);
    if (!property) throw new Error('Property not found');
    
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      propertyId: data.propertyId,
      propertyTitle: property.title,
      propertyUid: property.propertyUid,
      sellerId: property.ownerId,
      sellerName: property.ownerName,
      buyerId: data.buyerId,
      buyerName: 'Current Buyer',
      amount: data.amount,
      status: 'INITIATED',
      initiatedAt: new Date().toISOString(),
    };
    
    mockTransactions.push(newTransaction);
    return newTransaction;
  },

  async approve(transactionId: string, inspectorId: string, notes?: string): Promise<Transaction> {
    const transaction = mockTransactions.find(t => t.id === transactionId);
    if (!transaction) throw new Error('Transaction not found');
    
    transaction.status = 'COMPLETED';
    transaction.inspectorId = inspectorId;
    transaction.inspectorName = 'Inspector Name';
    transaction.completedAt = new Date().toISOString();
    transaction.notes = notes;
    
    // Create a new block
    const newBlock = createBlock(transaction);
    mockBlocks.push(newBlock);
    
    return transaction;
  },

  async reject(transactionId: string, inspectorId: string, notes: string): Promise<Transaction> {
    const transaction = mockTransactions.find(t => t.id === transactionId);
    if (!transaction) throw new Error('Transaction not found');
    
    transaction.status = 'REJECTED';
    transaction.inspectorId = inspectorId;
    transaction.inspectorName = 'Inspector Name';
    transaction.notes = notes;
    
    return transaction;
  },
};

// Block/Ledger API
export const blockAPI = {
  async getAll(): Promise<Block[]> {
    return mockBlocks;
  },

  async verify(startIndex?: number, endIndex?: number): Promise<ChainVerificationResult> {
    // Mock verification logic
    const blocksToVerify = mockBlocks.slice(startIndex || 0, endIndex);
    let isValid = true;
    const tamperedBlocks: number[] = [];
    
    for (let i = 1; i < blocksToVerify.length; i++) {
      const currentBlock = blocksToVerify[i];
      const previousBlock = blocksToVerify[i - 1];
      
      if (currentBlock.previousHash !== previousBlock.currentHash) {
        isValid = false;
        tamperedBlocks.push(currentBlock.blockIndex);
      }
    }
    
    return {
      isValid,
      totalBlocks: blocksToVerify.length,
      verifiedBlocks: blocksToVerify.length - tamperedBlocks.length,
      tamperedBlocks: tamperedBlocks.length > 0 ? tamperedBlocks : undefined,
      message: isValid ? 'Chain is valid' : 'Chain has been tampered',
    };
  },
};

// Dashboard API
export const dashboardAPI = {
  async getStats(): Promise<DashboardStats> {
    return {
      totalProperties: mockProperties.length,
      totalTransactions: mockTransactions.length,
      pendingTransactions: mockTransactions.filter(t => t.status === 'INITIATED' || t.status === 'UNDER_REVIEW').length,
      totalBlocks: mockBlocks.length,
      lastVerification: new Date().toISOString(),
      chainValid: true,
    };
  },
};

// Helper function to create a block
function createBlock(transaction: Transaction): Block {
  const previousBlock = mockBlocks[mockBlocks.length - 1];
  const previousHash = previousBlock?.currentHash || '0000000000000000';
  
  const blockData = {
    blockIndex: mockBlocks.length,
    timestamp: new Date().toISOString(),
    transactionData: {
      transactionId: transaction.id,
      propertyId: transaction.propertyId,
      propertyUid: transaction.propertyUid,
      fromOwner: transaction.sellerName,
      toOwner: transaction.buyerName,
      amount: transaction.amount,
    },
    previousHash,
    nonce: Math.floor(Math.random() * 1000000),
  };
  
  // Simple hash simulation
  const currentHash = simpleHash(JSON.stringify(blockData));
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    ...blockData,
    currentHash,
  };
}

// Simple hash function for demo
function simpleHash(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

// Mock Data
const mockProperties: Property[] = [
  {
    id: '1',
    propertyUid: 'PROP-A1B2C3',
    title: 'Luxury Villa in Downtown',
    address: '123 Main Street, Central District',
    area: 2500,
    description: 'Beautiful 4-bedroom villa with modern amenities, swimming pool, and garden.',
    status: 'FOR_SALE',
    price: 850000,
    ownerId: '1',
    ownerName: 'John Smith',
    registeredAt: '2024-01-15T10:30:00Z',
    documents: [
      {
        id: 'd1',
        fileName: 'title_deed.pdf',
        filePath: '/uploads/title_deed.pdf',
        checksum: 'sha256_abc123',
        uploadedAt: '2024-01-15T10:35:00Z',
      },
    ],
  },
  {
    id: '2',
    propertyUid: 'PROP-D4E5F6',
    title: 'Commercial Office Space',
    address: '456 Business Ave, Tech Park',
    area: 1200,
    description: 'Prime commercial property suitable for tech startups and corporate offices.',
    status: 'FOR_SALE',
    price: 1200000,
    ownerId: '2',
    ownerName: 'Sarah Johnson',
    registeredAt: '2024-02-20T14:20:00Z',
    documents: [],
  },
  {
    id: '3',
    propertyUid: 'PROP-G7H8I9',
    title: 'Residential Apartment',
    address: '789 Park Lane, Green Valley',
    area: 850,
    description: '2-bedroom apartment with balcony and parking space.',
    status: 'REGISTERED',
    price: 320000,
    ownerId: '3',
    ownerName: 'Michael Brown',
    registeredAt: '2024-03-10T09:15:00Z',
    documents: [],
  },
];

const mockTransactions: Transaction[] = [
  {
    id: 't1',
    propertyId: '1',
    propertyTitle: 'Luxury Villa in Downtown',
    propertyUid: 'PROP-A1B2C3',
    sellerId: '1',
    sellerName: 'John Smith',
    buyerId: '4',
    buyerName: 'Emily Davis',
    amount: 850000,
    status: 'UNDER_REVIEW',
    initiatedAt: '2024-11-08T10:00:00Z',
  },
  {
    id: 't2',
    propertyId: '2',
    propertyTitle: 'Commercial Office Space',
    propertyUid: 'PROP-D4E5F6',
    sellerId: '2',
    sellerName: 'Sarah Johnson',
    buyerId: '5',
    buyerName: 'Robert Wilson',
    amount: 1200000,
    status: 'INITIATED',
    initiatedAt: '2024-11-09T15:30:00Z',
  },
];

const mockBlocks: Block[] = [
  {
    id: 'b0',
    blockIndex: 0,
    timestamp: '2024-01-01T00:00:00Z',
    transactionData: {
      transactionId: 'genesis',
      propertyId: 'genesis',
      propertyUid: 'GENESIS',
      fromOwner: 'System',
      toOwner: 'System',
      amount: 0,
    },
    previousHash: '0000000000000000',
    currentHash: '00000a1b2c3d4e5f',
    nonce: 0,
  },
];
