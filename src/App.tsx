import React, { useState } from 'react';
import { AuthProvider, useAuth } from './lib/auth-context';
import { EnhancedAuthForm } from './components/EnhancedAuthForm';
import { EnhancedLayout } from './components/EnhancedLayout';
import { EnhancedDashboard } from './pages/EnhancedDashboard';
import { EnhancedProperties } from './pages/EnhancedProperties';
import { EnhancedTransactions } from './pages/EnhancedTransactions';
import { Blockchain } from './pages/Blockchain';
import { Users } from './pages/Users';
import { Toaster } from './components/ui/sonner';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
        <p className="text-gray-600">Loading DLRS...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <EnhancedAuthForm />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <EnhancedDashboard onNavigate={setCurrentPage} />;
      case 'properties':
        return <EnhancedProperties />;
      case 'transactions':
        return <EnhancedTransactions />;
      case 'blockchain':
        return <Blockchain />;
      case 'users':
        return <Users />;
      default:
        return <EnhancedDashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <EnhancedLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </EnhancedLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}