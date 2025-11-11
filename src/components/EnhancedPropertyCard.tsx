import React, { useState } from 'react';
import { Property } from '../types';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  MapPin, Maximize2, DollarSign, User, Calendar,
  FileText, Eye, ArrowRight, Building2, CheckCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { PropertyDetailsDialog } from './PropertyDetailsDialog';

interface EnhancedPropertyCardProps {
  property: Property;
  onInitiateTransaction?: (property: Property) => void;
  showActions?: boolean;
}

export function EnhancedPropertyCard({ 
  property, 
  onInitiateTransaction,
  showActions = true 
}: EnhancedPropertyCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FOR_SALE':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'SOLD':
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
      case 'UNDER_REVIEW':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      default:
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'FOR_SALE':
        return <DollarSign className="h-3 w-3" />;
      case 'SOLD':
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <FileText className="h-3 w-3" />;
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
          {/* Property Image Placeholder with Gradient */}
          <div className="relative h-48 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            
            {/* Decorative Building Icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <Building2 className="h-32 w-32 text-white" />
            </div>

            {/* Status Badge */}
            <div className="absolute top-4 left-4">
              <Badge className={`${getStatusColor(property.status)} shadow-lg`}>
                {getStatusIcon(property.status)}
                <span className="ml-1">{property.status.replace('_', ' ')}</span>
              </Badge>
            </div>

            {/* Property UID */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
              <code className="text-xs font-mono">{property.propertyUid}</code>
            </div>

            {/* Price Tag (if available) */}
            {property.price && (
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span className="text-xl font-bold text-gray-900">
                    {property.price.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <CardContent className="p-6">
            {/* Title and Description */}
            <div className="mb-4">
              <h3 className="text-xl mb-2 line-clamp-1 group-hover:text-purple-600 transition-colors">
                {property.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {property.description}
              </p>
            </div>

            {/* Property Details Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-start gap-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <MapPin className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm font-medium truncate">{property.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Maximize2 className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Area</p>
                  <p className="text-sm font-medium">{property.area} m²</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="p-2 bg-green-50 rounded-lg">
                  <User className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Owner</p>
                  <p className="text-sm font-medium truncate">{property.ownerName}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Calendar className="h-4 w-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Registered</p>
                  <p className="text-sm font-medium">
                    {new Date(property.registeredAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Documents Badge */}
            {property.documents.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                  <FileText className="h-4 w-4" />
                  <span>{property.documents.length} document(s) attached</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {showActions && (
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  className="flex-1 group/btn"
                  onClick={() => setShowDetails(true)}
                >
                  <Eye className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                  View Details
                </Button>
                
                {property.status === 'FOR_SALE' && onInitiateTransaction && (
                  <Button
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 group/btn"
                    onClick={() => onInitiateTransaction(property)}
                  >
                    Buy Now
                    <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <PropertyDetailsDialog
        property={property}
        open={showDetails}
        onClose={() => setShowDetails(false)}
      />
    </>
  );
}
