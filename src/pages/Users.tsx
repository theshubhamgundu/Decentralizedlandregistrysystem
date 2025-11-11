import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { User, UserPlus, Search } from 'lucide-react';

// Mock users data - In real app, this would come from API
const mockUsers = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@dlrs.com',
    fullName: 'System Administrator',
    role: 'ADMIN',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    username: 'inspector1',
    email: 'inspector@dlrs.com',
    fullName: 'John Inspector',
    role: 'INSPECTOR',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '3',
    username: 'seller1',
    email: 'seller@dlrs.com',
    fullName: 'Jane Seller',
    role: 'SELLER',
    createdAt: '2024-02-01T00:00:00Z',
  },
  {
    id: '4',
    username: 'buyer1',
    email: 'buyer@dlrs.com',
    fullName: 'Bob Buyer',
    role: 'BUYER',
    createdAt: '2024-02-15T00:00:00Z',
  },
];

export function Users() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users] = useState(mockUsers);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'INSPECTOR':
        return 'bg-blue-100 text-blue-800';
      case 'SELLER':
        return 'bg-green-100 text-green-800';
      case 'BUYER':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleStats = () => {
    const stats = users.reduce(
      (acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return [
      { role: 'ADMIN', count: stats.ADMIN || 0, color: 'bg-purple-100 text-purple-800' },
      { role: 'INSPECTOR', count: stats.INSPECTOR || 0, color: 'bg-blue-100 text-blue-800' },
      { role: 'SELLER', count: stats.SELLER || 0, color: 'bg-green-100 text-green-800' },
      { role: 'BUYER', count: stats.BUYER || 0, color: 'bg-orange-100 text-orange-800' },
    ];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">User Management</h1>
          <p className="text-gray-500 mt-1">Manage system users and their roles</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Role Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {getRoleStats().map((stat) => (
          <Card key={stat.role}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">{stat.role}</CardTitle>
              <User className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{stat.count}</div>
              <p className="text-xs text-gray-500 mt-1">Active users</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search users by name, username, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Users List */}
      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gray-100 rounded-full">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{user.fullName}</h3>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Joined</p>
                  <p className="text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No users found</p>
        </div>
      )}
    </div>
  );
}
