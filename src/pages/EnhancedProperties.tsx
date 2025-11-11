import React, { useEffect, useState } from 'react';
import { Property } from '../types';
import { propertyAPI } from '../lib/api';
import { EnhancedPropertyCard } from '../components/EnhancedPropertyCard';
import { RegisterPropertyDialog } from '../components/RegisterPropertyDialog';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  Plus, Search, Filter, Loader2, Home, 
  LayoutGrid, List, SlidersHorizontal
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

export function EnhancedProperties() {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [properties, searchQuery, statusFilter]);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const data = await propertyAPI.getAll();
      setProperties(data);
    } catch (error) {
      console.error('Failed to load properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = [...properties];

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.propertyUid.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    setFilteredProperties(filtered);
  };

  const handlePropertyRegistered = (property: Property) => {
    setProperties([property, ...properties]);
    toast.success('Property registered successfully!', {
      description: `${property.title} has been added to the registry.`,
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
        <p className="text-gray-500">Loading properties...</p>
      </div>
    );
  }

  const statusCounts = {
    all: properties.length,
    REGISTERED: properties.filter(p => p.status === 'REGISTERED').length,
    FOR_SALE: properties.filter(p => p.status === 'FOR_SALE').length,
    SOLD: properties.filter(p => p.status === 'SOLD').length,
    UNDER_REVIEW: properties.filter(p => p.status === 'UNDER_REVIEW').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl mb-2">Property Registry</h1>
          <p className="text-gray-600">
            Browse and manage registered properties
          </p>
        </div>
        <Button
          onClick={() => setShowRegisterDialog(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Register Property
        </Button>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Home className="h-5 w-5 text-purple-600" />
                  <span className="text-2xl font-bold">{statusCounts.all}</span>
                </div>
                <p className="text-sm text-gray-600">Total Properties</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600 mb-2">{statusCounts.REGISTERED}</p>
                <p className="text-sm text-gray-600">Registered</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600 mb-2">{statusCounts.FOR_SALE}</p>
                <p className="text-sm text-gray-600">For Sale</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600 mb-2">{statusCounts.SOLD}</p>
                <p className="text-sm text-gray-600">Sold</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600 mb-2">{statusCounts.UNDER_REVIEW}</p>
                <p className="text-sm text-gray-600">Under Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by title, address, or UID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="REGISTERED">Registered</SelectItem>
                  <SelectItem value="FOR_SALE">For Sale</SelectItem>
                  <SelectItem value="SOLD">Sold</SelectItem>
                  <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery || statusFilter !== 'all') && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Active filters:</span>
                {searchQuery && (
                  <Badge variant="outline">
                    Search: {searchQuery}
                    <button
                      onClick={() => setSearchQuery('')}
                      className="ml-2 hover:text-red-600"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {statusFilter !== 'all' && (
                  <Badge variant="outline">
                    Status: {statusFilter.replace('_', ' ')}
                    <button
                      onClick={() => setStatusFilter('all')}
                      className="ml-2 hover:text-red-600"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  className="ml-auto text-sm"
                >
                  Clear all
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Properties Grid/List */}
      <AnimatePresence mode="wait">
        {filteredProperties.length > 0 ? (
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={
              viewMode === 'grid'
                ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'
                : 'space-y-4'
            }
          >
            {filteredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <EnhancedPropertyCard property={property} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="p-6 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Home className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl mb-2">No Properties Found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by registering your first property'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Button
                onClick={() => setShowRegisterDialog(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                Register Property
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Register Dialog */}
      <RegisterPropertyDialog
        open={showRegisterDialog}
        onClose={() => setShowRegisterDialog(false)}
        onPropertyRegistered={handlePropertyRegistered}
      />
    </div>
  );
}
