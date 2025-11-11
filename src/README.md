# 🏛️ Decentralized Land Registry System (DLRS)

A modern, blockchain-powered land management platform that ensures secure property registration and ownership transfers through cryptographic verification and immutable record-keeping.

![DLRS Banner](https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=300&fit=crop)

## ✨ Features

### 🔐 Blockchain Security
- **SHA-256 Cryptographic Hashing**: Industry-standard security for all records
- **Proof-of-Work Mining**: Difficulty-4 mining ensures block integrity
- **Chain Verification**: Real-time blockchain integrity verification
- **Immutable Records**: Once recorded, ownership transfers cannot be altered
- **Tamper Detection**: Automatically detects any modifications to historical records

### 👥 Role-Based Access Control
- **Admin**: System oversight, user management, and health monitoring
- **Inspector**: Transaction review and approval authority
- **Seller**: Property registration and sale management
- **Buyer**: Property browsing and purchase requests

### 🏘️ Property Management
- Complete property registration with documents
- Property status tracking (Registered, For Sale, Sold, Under Review)
- Document attachment with checksum verification
- Advanced search and filtering
- Property ownership history via blockchain

### 📊 Transaction Management
- Secure ownership transfer requests
- Inspector approval workflow
- Automatic blockchain record creation
- Transaction history and audit trail
- Real-time status updates

### 📈 Analytics Dashboard
- Real-time statistics and metrics
- Role-specific views and actions
- Recent activity tracking
- System health monitoring
- Blockchain integrity status

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/UI** components
- **Motion (Framer Motion)** for animations
- **Lucide React** for icons
- **Sonner** for notifications

### Backend Options
- **Java Spring Boot** (recommended for production)
- **Supabase** (database and optional backend)

### Database
- **PostgreSQL** via Supabase
- Complete schema with RLS (Row Level Security)
- Optimized indexes for performance

### Blockchain
- **SHA-256** hashing algorithm
- **Proof-of-Work** consensus mechanism
- **Difficulty**: 4 (customizable)
- **Web Crypto API** for hash calculations

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Supabase account (free tier works)
- Vercel account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dlrs.git
   cd dlrs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

4. **Set up Supabase database**
   - Go to your Supabase project
   - Open SQL Editor
   - Copy and paste contents of `/supabase/schema.sql`
   - Execute the SQL script

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:5173
   ```

## 📦 Deployment

### Deploy to Vercel

1. **Push your code to GitHub**

2. **Import project in Vercel**
   - Go to https://vercel.com/new
   - Import your repository
   - Vercel will auto-detect the Vite configuration

3. **Add environment variables**
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Deploy**
   - Click "Deploy"
   - Your app will be live in ~2 minutes

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Vercel)                     │
│  React + TypeScript + Tailwind CSS + Blockchain Logic       │
└───────────────────────────┬─────────────────────────────────┘
                            │
                ┌───────────┴──────────┐
                │                      │
    ┌───────────▼──────────┐  ┌────────▼────────────┐
    │  Supabase (Database) │  │  Spring Boot (API)  │
    │     PostgreSQL       │  │   Java Backend      │
    └──────────────────────┘  └─────────────────────┘
```

### Data Flow

1. **User Action** → Frontend captures user interaction
2. **API Call** → Frontend sends request to backend
3. **Transaction Processing** → Backend processes the request
4. **Blockchain Mining** → On approval, new block is mined
5. **Database Update** → Block is saved to database
6. **Chain Verification** → Integrity is verified
7. **UI Update** → Frontend displays the result

## 🔧 Backend Integration

### Option 1: Java Spring Boot (Recommended)

See the `/backend-guide` folder for:
- `application.properties.example` - Configuration template
- `BlockchainController.java.example` - REST API controller
- `BlockchainService.java.example` - Business logic with mining

### Option 2: Supabase Only

The frontend can work directly with Supabase:
- Update `/lib/api.ts` to use Supabase client
- Use Supabase Edge Functions for complex operations
- Enable Row Level Security (RLS) for data protection

## 📝 How the Blockchain Works

### Block Structure
```typescript
{
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
```

### Mining Process
1. Create new block with transaction data
2. Link to previous block via `previousHash`
3. Find a `nonce` that produces a hash starting with "0000"
4. This proof-of-work ensures computational cost to modify history
5. Save block with valid hash to database

### Verification
1. Recalculate hash for each block
2. Compare with stored hash
3. Verify `previousHash` links are intact
4. Report any tampering attempts

## 🎨 UI Features

### Advanced Blockchain Viewer
- **Animated Chain Visualization**: See blocks connected in real-time
- **Interactive Block Cards**: Click to expand and view details
- **Status Indicators**: Visual feedback for verified/tampered blocks
- **Grid/Chain Views**: Toggle between different visualization modes
- **Progress Indicators**: See verification progress
- **Color-Coded Security**: Green (valid), Red (tampered), Orange (suspicious)

### Responsive Design
- Works on desktop, tablet, and mobile
- Adaptive layouts for different screen sizes
- Touch-friendly interface
- Optimized animations

## 🧪 Testing

### Test the Blockchain

1. **Login** with any credentials (demo mode)
2. **Register a Property**:
   - Go to Properties page
   - Click "Register Property"
   - Fill in details and submit
3. **Create a Transaction**:
   - Click on a property "For Sale"
   - Click "Buy Property"
   - Confirm transaction
4. **Approve Transaction** (as Inspector):
   - Go to Transactions page
   - Find pending transaction
   - Click "Approve"
   - Add notes and confirm
5. **View Blockchain**:
   - Go to Blockchain page
   - See the new block added
   - Click "Verify Chain Integrity"
   - Confirm all blocks are valid

## 📊 Database Schema

The system uses 5 main tables:
- **users**: User accounts with roles
- **properties**: Land property records
- **property_documents**: Attached documents
- **transactions**: Ownership transfer requests
- **blocks**: Immutable blockchain ledger

See `/supabase/schema.sql` for complete schema.

## 🔒 Security Features

- SHA-256 cryptographic hashing
- Proof-of-work mining (difficulty 4)
- Row Level Security (RLS) in database
- CORS protection
- XSS protection headers
- Input validation
- SQL injection prevention
- Secure authentication tokens

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

Built with ❤️ for secure and transparent land management

## 🙏 Acknowledgments

- Inspired by blockchain technology and land registry systems worldwide
- Built with modern web technologies
- Designed for transparency and security

## 📞 Support

For support, please open an issue in the GitHub repository.

---

**Note**: This is a demonstration system. For production use, ensure proper security audits, legal compliance, and infrastructure setup.
