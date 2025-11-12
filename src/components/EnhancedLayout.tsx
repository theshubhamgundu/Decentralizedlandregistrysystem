import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../lib/auth-context';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import {
  LayoutDashboard,
  Home,
  FileText,
  Database,
  Users,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Shield,
  Sparkles,
  Bell,
  Settings,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EnhancedLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function EnhancedLayout({ children, currentPage, onNavigate }: EnhancedLayoutProps) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'INSPECTOR', 'SELLER', 'BUYER'],
    },
    {
      id: 'properties',
      label: 'Properties',
      icon: Home,
      roles: ['ADMIN', 'INSPECTOR', 'SELLER', 'BUYER'],
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: FileText,
      roles: ['ADMIN', 'INSPECTOR', 'SELLER', 'BUYER'],
    },
    {
      id: 'blockchain',
      label: 'Blockchain',
      icon: Database,
      roles: ['ADMIN', 'INSPECTOR'],
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      roles: ['ADMIN'],
    },
  ];

  const visibleItems = navigationItems.filter(
    (item) => !user?.role || item.roles.includes(user.role)
  );

  const getRoleBadge = () => {
    const colors = {
      ADMIN: 'bg-gradient-to-r from-purple-500 to-pink-500',
      INSPECTOR: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      SELLER: 'bg-gradient-to-r from-green-500 to-emerald-500',
      BUYER: 'bg-gradient-to-r from-orange-500 to-red-500',
    };
    return colors[user?.role as keyof typeof colors] || 'bg-gray-500';
  };

  const getRoleIcon = () => {
    if (user?.role === 'ADMIN') return Shield;
    if (user?.role === 'INSPECTOR') return Shield;
    return Sparkles;
  };

  const RoleIcon = getRoleIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Top Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b shadow-sm"
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X /> : <Menu />}
              </Button>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl">DLRS</h1>
                  <p className="text-xs text-gray-500 hidden sm:block">
                    Decentralized Land Registry
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {visibleItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? 'default' : 'ghost'}
                  onClick={() => onNavigate(item.id)}
                  className={
                    currentPage === item.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : ''
                  }
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>

              <div className="relative">
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 hover:bg-gray-100 h-10"
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      {user?.fullName?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium">{user?.fullName || 'User'}</p>
                    <p className="text-xs text-gray-500">{user?.role || 'Role'}</p>
                  </div>
                  {profileOpen ? (
                    <ChevronUp className="h-4 w-4 ml-1 transition-transform duration-200" />
                  ) : (
                    <ChevronDown className="h-4 w-4 ml-1 transition-transform duration-200" />
                  )}
                </Button>

                {profileOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50"
                    style={{
                      position: 'fixed',
                      zIndex: 1000,
                    }}
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium">{user?.fullName || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
                    </div>
                    <div className="py-1">
                      <button 
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <Settings className="h-4 w-4 mr-2 text-gray-600" />
                        Profile Settings
                      </button>
                      <button 
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <Shield className="h-4 w-4 mr-2 text-gray-600" />
                        Account Security
                      </button>
                    </div>
                    <div className="border-t border-gray-100"></div>
                    <button 
                      onClick={logout} 
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
                {profileOpen && (
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileOpen(false)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-16 bottom-0 w-72 bg-white shadow-2xl z-40 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                {/* Role Badge */}
                <div className={`${getRoleBadge()} p-4 rounded-xl text-white mb-6`}>
                  <div className="flex items-center gap-2 mb-2">
                    <RoleIcon className="h-5 w-5" />
                    <span className="font-semibold">{user?.role}</span>
                  </div>
                  <p className="text-sm opacity-90">{user?.fullName}</p>
                </div>

                {/* Navigation Items */}
                <nav className="space-y-2">
                  {visibleItems.map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ x: 4 }}
                      onClick={() => {
                        onNavigate(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                        currentPage === item.id
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {currentPage === item.id && <ChevronRight className="h-5 w-5" />}
                    </motion.button>
                  ))}
                </nav>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-20 px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              © 2024 DLRS - Decentralized Land Registry System
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                System Operational
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
