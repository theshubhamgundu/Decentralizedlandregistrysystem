-- Decentralized Land Registry System (DLRS) Database Schema
-- This schema should be run in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'INSPECTOR', 'SELLER', 'BUYER')),
  full_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_uid VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  address TEXT NOT NULL,
  area DECIMAL(10, 2) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL CHECK (status IN ('REGISTERED', 'FOR_SALE', 'SOLD', 'UNDER_REVIEW')),
  price DECIMAL(15, 2),
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  owner_name VARCHAR(100) NOT NULL,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property documents table
CREATE TABLE IF NOT EXISTS property_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  file_name VARCHAR(200) NOT NULL,
  file_path TEXT NOT NULL,
  checksum VARCHAR(100) NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES users(id) ON DELETE SET NULL,
  seller_name VARCHAR(100) NOT NULL,
  buyer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  buyer_name VARCHAR(100) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('INITIATED', 'UNDER_REVIEW', 'APPROVED', 'COMPLETED', 'REJECTED')),
  initiated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  inspector_id UUID REFERENCES users(id) ON DELETE SET NULL,
  inspector_name VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blocks table (Blockchain ledger)
CREATE TABLE IF NOT EXISTS blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  block_index INTEGER UNIQUE NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  property_uid VARCHAR(50) NOT NULL,
  from_owner VARCHAR(100) NOT NULL,
  to_owner VARCHAR(100) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  previous_hash VARCHAR(64) NOT NULL,
  current_hash VARCHAR(64) UNIQUE NOT NULL,
  nonce INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_property_uid ON properties(property_uid);

CREATE INDEX IF NOT EXISTS idx_property_documents_property_id ON property_documents(property_id);

CREATE INDEX IF NOT EXISTS idx_transactions_property_id ON transactions(property_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller_id ON transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer_id ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

CREATE INDEX IF NOT EXISTS idx_blocks_block_index ON blocks(block_index);
CREATE INDEX IF NOT EXISTS idx_blocks_transaction_id ON blocks(transaction_id);
CREATE INDEX IF NOT EXISTS idx_blocks_current_hash ON blocks(current_hash);
CREATE INDEX IF NOT EXISTS idx_blocks_previous_hash ON blocks(previous_hash);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert genesis block
INSERT INTO blocks (
  block_index,
  timestamp,
  property_uid,
  from_owner,
  to_owner,
  amount,
  previous_hash,
  current_hash,
  nonce
) VALUES (
  0,
  '2024-01-01 00:00:00+00',
  'GENESIS',
  'System',
  'System',
  0,
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000a3f5e8c2d9b4f7a1e6d3c8b5a2f9e4d1c8b5a2f9e6d3c0b7a4f1e8d5c2b9',
  45678
) ON CONFLICT (block_index) DO NOTHING;

-- Row Level Security (RLS) policies
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Properties policies
CREATE POLICY "Anyone can view properties" ON properties
  FOR SELECT USING (true);

CREATE POLICY "Sellers can create properties" ON properties
  FOR INSERT WITH CHECK (auth.uid()::text = owner_id::text);

CREATE POLICY "Owners can update their properties" ON properties
  FOR UPDATE USING (auth.uid()::text = owner_id::text);

-- Property documents policies
CREATE POLICY "Anyone can view property documents" ON property_documents
  FOR SELECT USING (true);

CREATE POLICY "Property owners can add documents" ON property_documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_documents.property_id
      AND properties.owner_id::text = auth.uid()::text
    )
  );

-- Transactions policies
CREATE POLICY "Anyone can view transactions" ON transactions
  FOR SELECT USING (true);

CREATE POLICY "Buyers can create transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid()::text = buyer_id::text);

CREATE POLICY "Inspectors can update transactions" ON transactions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id::text = auth.uid()::text
      AND users.role = 'INSPECTOR'
    )
  );

-- Blocks policies (read-only for security)
CREATE POLICY "Anyone can view blocks" ON blocks
  FOR SELECT USING (true);

CREATE POLICY "Only system can insert blocks" ON blocks
  FOR INSERT WITH CHECK (false); -- Blocks should only be created via backend

-- Views for easier querying
CREATE OR REPLACE VIEW property_details AS
SELECT 
  p.*,
  COUNT(pd.id) as document_count,
  COALESCE(json_agg(
    json_build_object(
      'id', pd.id,
      'file_name', pd.file_name,
      'file_path', pd.file_path,
      'checksum', pd.checksum,
      'uploaded_at', pd.uploaded_at
    )
  ) FILTER (WHERE pd.id IS NOT NULL), '[]') as documents
FROM properties p
LEFT JOIN property_documents pd ON p.id = pd.property_id
GROUP BY p.id;

CREATE OR REPLACE VIEW blockchain_stats AS
SELECT 
  COUNT(*) as total_blocks,
  MAX(block_index) as chain_height,
  SUM(amount) as total_volume,
  COUNT(DISTINCT property_uid) as unique_properties
FROM blocks;

CREATE OR REPLACE VIEW transaction_stats AS
SELECT 
  COUNT(*) as total_transactions,
  COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed_transactions,
  COUNT(CASE WHEN status = 'INITIATED' OR status = 'UNDER_REVIEW' THEN 1 END) as pending_transactions,
  SUM(CASE WHEN status = 'COMPLETED' THEN amount ELSE 0 END) as total_transaction_value
FROM transactions;

-- Comments for documentation
COMMENT ON TABLE users IS 'System users with role-based access';
COMMENT ON TABLE properties IS 'Registered land properties';
COMMENT ON TABLE property_documents IS 'Documents attached to properties';
COMMENT ON TABLE transactions IS 'Property ownership transfer transactions';
COMMENT ON TABLE blocks IS 'Immutable blockchain ledger of approved transactions';
