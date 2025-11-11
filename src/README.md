# 🏛️ DLRS - Decentralized Land Registry System

A next-generation blockchain-powered property management platform with an enterprise-grade UI/UX. This system provides secure property registration and ownership transfers through an immutable blockchain ledger.

## ✨ Features

### 🎨 Modern UI/UX
- **Glassmorphism & Gradient Design**: Beautiful modern interface with gradient effects and backdrop blur
- **Smooth Animations**: Motion-powered transitions and micro-interactions throughout the app
- **Responsive Layout**: Fully responsive design optimized for desktop, tablet, and mobile
- **Dark Mode Ready**: Built with dark mode support in the design system
- **Interactive Components**: Hover effects, loading states, and visual feedback

### 🔐 Blockchain Implementation
- **SHA-256 Hashing**: Real cryptographic hashing using Web Crypto API
- **Proof of Work**: Mining simulation with configurable difficulty
- **Chain Verification**: Complete blockchain integrity verification
- **Block Explorer**: Interactive visualization with detailed block information
- **Tamper Detection**: Automatic detection of modified blocks
- **Merkle Trees**: Support for transaction merkle root calculation

### 👥 Role-Based Access Control
- **Admin**: Full system access, user management, blockchain oversight
- **Inspector**: Review and approve/reject property transactions
- **Seller**: Register properties and manage listings
- **Buyer**: Browse properties and initiate purchase transactions

### 🏠 Property Management
- **Property Registration**: Register new properties with documents
- **Document Upload**: Attach legal documents with checksum verification
- **Status Tracking**: Track property status (Registered, For Sale, Sold, Under Review)
- **Advanced Search**: Filter and search properties by multiple criteria
- **Grid & List Views**: Switch between different viewing modes

### 💼 Transaction Processing
- **Initiate Transfers**: Buyers can initiate property purchase transactions
- **Inspector Review**: Multi-stage approval workflow
- **Status Tracking**: Real-time transaction status updates
- **Blockchain Recording**: Approved transactions create immutable blocks
- **Transaction History**: Complete audit trail of all property transfers

### 📊 Dashboard Analytics
- **Real-time Statistics**: Live stats on properties, transactions, and blockchain
- **Role-Specific Views**: Customized dashboard based on user role
- **Activity Timeline**: Recent property and transaction activity
- **System Health**: Blockchain integrity and system status monitoring

## 🚀 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS v4** for styling
- **Motion (Framer Motion)** for animations
- **Shadcn/ui** component library
- **Lucide React** for icons
- **Sonner** for toast notifications
- **Recharts** for data visualization

### Blockchain
- **Web Crypto API** for SHA-256 hashing
- **Proof of Work** algorithm
- **Custom blockchain utilities**

### State Management
- **React Context API** for authentication
- **Local State** with React hooks

### Planned Backend
- **Java Spring Boot** (to be connected)
- **Supabase/MySQL** for database
- **JWT** authentication
- **REST API**

## 📁 Project Structure

```
/
├── components/
│   ├── ui/                          # Shadcn UI components
│   ├── EnhancedAuthForm.tsx        # Modern login/register form
│   ├── EnhancedBlockchainViewer.tsx # Advanced blockchain explorer
│   ├── EnhancedDashboardStats.tsx  # Animated statistics cards
│   ├── EnhancedLayout.tsx          # Main app layout with navigation
│   ├── EnhancedPropertyCard.tsx    # Property display card
│   ├── ApproveTransactionDialog.tsx # Transaction approval modal
│   ├── PropertyDetailsDialog.tsx   # Property details modal
│   ├── RegisterPropertyDialog.tsx  # Property registration form
│   └── TransactionCard.tsx         # Transaction display card
│
├── pages/
│   ├── EnhancedDashboard.tsx       # Role-based dashboard
│   ├── EnhancedProperties.tsx      # Property listing & management
│   ├── EnhancedTransactions.tsx    # Transaction management
│   ├── Blockchain.tsx              # Blockchain explorer page
│   └── Users.tsx                   # User management (Admin only)
│
├── lib/
│   ├── api.ts                      # API layer with mock data
│   └── auth-context.tsx            # Authentication context
│
├── utils/
│   └── blockchain.ts               # Blockchain cryptographic utilities
│
├── types/
│   └── index.ts                    # TypeScript type definitions
│
└── styles/
    └── globals.css                 # Global styles and design tokens
```

## 🎯 Key Features Deep Dive

### Blockchain Visualization
- **Chain View**: Vertical blockchain display with linking animations
- **Grid View**: Card-based block overview
- **Expandable Blocks**: Click to see full transaction details
- **Hash Display**: Full cryptographic hashes with color coding
- **Verification Animation**: Progressive verification with progress indicator
- **Tamper Detection**: Visual highlighting of compromised blocks

### Enhanced Dashboard
- **Animated Stats Cards**: Gradient backgrounds with hover effects
- **Quick Actions**: Fast navigation to key features
- **Recent Activity**: Timeline of latest properties and transactions
- **Role-Specific Alerts**: Inspector notifications, admin system health
- **Progress Indicators**: Visual representation of pending work

### Property Cards
- **Gradient Headers**: Visually distinct property cards
- **Status Badges**: Color-coded status indicators
- **Detailed Information**: Area, owner, price, registration date
- **Document Indicators**: Shows attached documents count
- **Quick Actions**: View details or initiate purchase

### Transaction Management
- **Status Timeline**: Visual progression of transaction status
- **Transfer Visualization**: Clear from/to ownership display
- **Amount Highlighting**: Prominent transaction amount
- **Action Buttons**: Role-based approve/reject functionality
- **Notes System**: Inspector can add approval/rejection notes

## 🔧 Installation & Setup

1. **Clone or access the project**

2. **No installation needed!** - This project runs in Figma Make environment

3. **Login to the app**:
   - Username: `any username`
   - Password: `any password`
   - Select a role (Admin, Inspector, Seller, or Buyer)

## 🎮 Usage Guide

### As a Buyer
1. Browse properties on the Properties page
2. View property details
3. Initiate a purchase transaction
4. Track transaction status

### As a Seller
1. Register new properties
2. Upload property documents
3. Set property status to "For Sale"
4. Monitor transaction requests

### As an Inspector
1. Review pending transactions in Transactions page
2. Click "Review" on a transaction
3. Approve or reject with notes
4. Approved transactions create blockchain blocks

### As an Admin
1. Monitor system health on Dashboard
2. View all users in Users page
3. Verify blockchain integrity
4. Oversee all operations

## 🔐 Security Features

- **Immutable Ledger**: Once a block is created, it cannot be altered
- **Cryptographic Hashing**: SHA-256 ensures data integrity
- **Proof of Work**: Mining difficulty prevents easy blockchain manipulation
- **Chain Verification**: Detect any tampering in the blockchain
- **Document Checksums**: Verify document integrity
- **Role-Based Access**: Users can only perform authorized actions

## 📱 Responsive Design

The application is fully responsive across all device sizes:
- **Desktop** (1920px+): Full layout with sidebar
- **Laptop** (1024px-1919px): Optimized spacing
- **Tablet** (768px-1023px): Adapted layout
- **Mobile** (320px-767px): Mobile-first design with hamburger menu

## 🎨 Design System

### Color Palette
- **Primary Gradient**: Purple (#9333ea) to Pink (#ec4899)
- **Secondary Gradient**: Blue to Cyan
- **Success**: Green
- **Warning**: Orange
- **Error**: Red

### Typography
- **Font Family**: System fonts (-apple-system, Segoe UI, Roboto)
- **Font Weights**: Normal (400), Medium (500)
- **Responsive Sizing**: Scales with viewport

### Animations
- **Page Transitions**: Fade and slide effects
- **Card Hover**: Elevation and scale
- **Button Interactions**: Ripple and color transitions
- **Loading States**: Smooth spinners and skeletons
- **Blockchain Links**: Pulsing connection indicators

## 🔄 API Integration (For Backend)

The `/lib/api.ts` file provides a complete API layer structure. To connect to your Java Spring Boot backend:

1. Update `API_BASE_URL` in `/lib/api.ts`
2. Replace mock functions with actual fetch calls
3. Ensure backend endpoints match the API structure
4. Add JWT token handling

Example backend endpoints needed:
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/properties
POST   /api/properties
GET    /api/transactions
POST   /api/transactions
POST   /api/transactions/:id/approve
POST   /api/transactions/:id/reject
GET    /api/blocks
POST   /api/blocks/verify
GET    /api/dashboard/stats
```

## 🚢 Deployment

### Frontend (Vercel)
1. Connect your repository to Vercel
2. Configure build settings (React app)
3. Deploy

### Backend (Spring Boot + Supabase)
1. Set up Supabase project
2. Configure database connection in Spring Boot
3. Deploy Spring Boot to your preferred hosting
4. Update `API_BASE_URL` in frontend

## 🤝 Contributing

This is a prototype/demo application. For production use:
1. Implement real backend with Spring Boot
2. Add comprehensive error handling
3. Implement proper authentication (JWT)
4. Add input validation
5. Implement file upload to cloud storage
6. Add comprehensive testing
7. Implement logging and monitoring

## 📄 License

This project is provided as-is for educational and demonstration purposes.

## 🙏 Acknowledgments

- **Shadcn/ui** for the beautiful component library
- **Tailwind CSS** for the utility-first CSS framework
- **Motion** for smooth animations
- **Lucide** for the icon set

---

**Built with ❤️ using modern web technologies and blockchain concepts**

For questions or support, please refer to the documentation or create an issue.
