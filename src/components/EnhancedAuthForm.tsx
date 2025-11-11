import React, { useState } from 'react';
import { useAuth } from '../lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Database, Shield, Sparkles, Loader2, 
  Mail, Lock, User, Building2, CheckCircle2 
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { UserRole } from '../types';

export function EnhancedAuthForm() {
  const { login, register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Login state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register state
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    role: 'BUYER' as UserRole,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(loginUsername, loginPassword);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(registerData);
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const roleInfo = {
    ADMIN: { icon: Shield, color: 'from-purple-500 to-pink-500', desc: 'Full system access' },
    INSPECTOR: { icon: Shield, color: 'from-blue-500 to-cyan-500', desc: 'Approve transactions' },
    SELLER: { icon: Building2, color: 'from-green-500 to-emerald-500', desc: 'List properties' },
    BUYER: { icon: Sparkles, color: 'from-orange-500 to-red-500', desc: 'Purchase properties' },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-purple-300/20 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight 
            }}
            animate={{
              y: [null, Math.random() * -200 - 100],
              x: [null, Math.random() * 200 - 100],
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-5xl relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:block"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-2xl">
                  <Database className="h-12 w-12 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl mb-2">DLRS</h1>
                  <p className="text-gray-600">Decentralized Land Registry System</p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h2 className="text-2xl mb-4">Blockchain-Powered Property Management</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Immutable Records</h3>
                      <p className="text-sm text-gray-600">
                        All transactions are recorded on an immutable blockchain ledger
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Secure Transfers</h3>
                      <p className="text-sm text-gray-600">
                        Multi-role verification ensures secure property ownership transfers
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Transparent Process</h3>
                      <p className="text-sm text-gray-600">
                        Complete transparency with cryptographic verification
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {Object.entries(roleInfo).map(([role, info]) => {
                  const RoleIcon = info.icon;
                  return (
                    <div
                      key={role}
                      className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200"
                    >
                      <div className={`p-2 bg-gradient-to-br ${info.color} rounded-lg inline-block mb-2`}>
                        <RoleIcon className="h-5 w-5 text-white" />
                      </div>
                      <p className="font-semibold text-sm">{role}</p>
                      <p className="text-xs text-gray-600">{info.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right Side - Auth Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="border-0 shadow-2xl">
              <CardHeader className="space-y-1 pb-4">
                <div className="flex items-center gap-3 mb-4 md:hidden">
                  <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
                    <Database className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">DLRS</CardTitle>
                    <CardDescription>Land Registry System</CardDescription>
                  </div>
                </div>
                <CardTitle className="text-2xl">Welcome</CardTitle>
                <CardDescription>
                  Sign in to your account or create a new one
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>

                  {/* Login Tab */}
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-username">Username</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="login-username"
                            placeholder="Enter your username"
                            value={loginUsername}
                            onChange={(e) => setLoginUsername(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="login-password"
                            type="password"
                            placeholder="Enter your password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Register Tab */}
                  <TabsContent value="register">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reg-fullname">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="reg-fullname"
                            placeholder="John Doe"
                            value={registerData.fullName}
                            onChange={(e) =>
                              setRegisterData({ ...registerData, fullName: e.target.value })
                            }
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reg-username">Username</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="reg-username"
                            placeholder="johndoe"
                            value={registerData.username}
                            onChange={(e) =>
                              setRegisterData({ ...registerData, username: e.target.value })
                            }
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reg-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="reg-email"
                            type="email"
                            placeholder="john@example.com"
                            value={registerData.email}
                            onChange={(e) =>
                              setRegisterData({ ...registerData, email: e.target.value })
                            }
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reg-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="reg-password"
                            type="password"
                            placeholder="Create a password"
                            value={registerData.password}
                            onChange={(e) =>
                              setRegisterData({ ...registerData, password: e.target.value })
                            }
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reg-role">Role</Label>
                        <Select
                          value={registerData.role}
                          onValueChange={(value) =>
                            setRegisterData({ ...registerData, role: value as UserRole })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BUYER">
                              <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4" />
                                Buyer
                              </div>
                            </SelectItem>
                            <SelectItem value="SELLER">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                Seller
                              </div>
                            </SelectItem>
                            <SelectItem value="INSPECTOR">
                              <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                Inspector
                              </div>
                            </SelectItem>
                            <SelectItem value="ADMIN">
                              <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                Admin
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          'Create Account'
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
