import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth-context';
import { Property } from '../types';
import { propertyAPI, transactionAPI } from '../lib/api';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyDetailsDialog } from '../components/PropertyDetailsDialog';
import { RegisterPropertyDialog } from '../components/RegisterPropertyDialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Loader2, Plus, Search, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function Properties() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

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

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.address.toLowerCase().includes(query) ||
          p.propertyUid.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    // For buyers, show only properties for sale
    if (user?.role === 'BUYER') {
      filtered = filtered.filter((p) => p.status === 'FOR_SALE');
    }

    // For sellers, show only their own properties
    if (user?.role === 'SELLER') {
      filtered = filtered.filter((p) => p.ownerId === user.id);
    }

    setFilteredProperties(filtered);
  };

  const handlePurchaseRequest = async (property: Property) => {
    if (!user) return;

    try {
      await transactionAPI.create({
        propertyId: property.id,
        buyerId: user.id,
        amount: property.price || 0,
      });

      toast.success('Purchase request submitted successfully!');
      setSelectedProperty(null);
      loadProperties();
    } catch (error) {
      toast.error('Failed to submit purchase request');
      console.error(error);
    }
  };

  const handleMarkForSale = async (property: Property) => {
    try {
      await propertyAPI.updateStatus(property.id, 'FOR_SALE');
      toast.success('Property marked for sale!');
      setSelectedProperty(null);
      loadProperties();
    } catch (error) {
      toast.error('Failed to update property status');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Properties</h1>
          <p className="text-gray-500 mt-1">
            {user?.role === 'BUYER' && 'Browse available properties'}
            {user?.role === 'SELLER' && 'Manage your property listings'}
            {(user?.role === 'ADMIN' || user?.role === 'INSPECTOR') && 'All registered properties'}
          </p>
        </div>
        {user?.role === 'SELLER' && (
          <Button onClick={() => setShowRegisterDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Register Property
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by title, address, or UID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {user?.role !== 'BUYER' && (
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="REGISTERED">Registered</SelectItem>
              <SelectItem value="FOR_SALE">For Sale</SelectItem>
              <SelectItem value="SOLD">Sold</SelectItem>
              <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Properties Grid */}
      {filteredProperties.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onView={setSelectedProperty}
              actionButton={
                user?.role === 'BUYER' && property.status === 'FOR_SALE' ? (
                  <Button
                    className="flex-1"
                    onClick={() => setSelectedProperty(property)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Purchase
                  </Button>
                ) : null
              }
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {searchQuery || statusFilter !== 'all'
              ? 'No properties match your filters'
              : user?.role === 'SELLER'
              ? 'You haven\'t registered any properties yet'
              : 'No properties available'}
          </p>
          {user?.role === 'SELLER' && !searchQuery && statusFilter === 'all' && (
            <Button className="mt-4" onClick={() => setShowRegisterDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Register Your First Property
            </Button>
          )}
        </div>
      )}

      {/* Property Details Dialog */}
      <PropertyDetailsDialog
        property={selectedProperty}
        open={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
        actionButton={
          selectedProperty && (
            <>
              {user?.role === 'BUYER' && selectedProperty.status === 'FOR_SALE' && (
                <Button
                  className="w-full"
                  onClick={() => handlePurchaseRequest(selectedProperty)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Submit Purchase Request
                </Button>
              )}
              {user?.role === 'SELLER' &&
                selectedProperty.ownerId === user.id &&
                selectedProperty.status === 'REGISTERED' && (
                  <Button
                    className="w-full"
                    onClick={() => handleMarkForSale(selectedProperty)}
                  >
                    Mark as For Sale
                  </Button>
                )}
            </>
          )
        }
      />

      {/* Register Property Dialog */}
      <RegisterPropertyDialog
        open={showRegisterDialog}
        onClose={() => setShowRegisterDialog(false)}
        onSuccess={loadProperties}
      />
    </div>
  );
}
