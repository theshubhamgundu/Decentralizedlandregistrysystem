import React from 'react';
import { Property } from '../types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, Square, FileText, Eye } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onView: (property: Property) => void;
  actionButton?: React.ReactNode;
}

export function PropertyCard({ property, onView, actionButton }: PropertyCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FOR_SALE':
        return 'bg-green-100 text-green-800';
      case 'SOLD':
        return 'bg-gray-100 text-gray-800';
      case 'UNDER_REVIEW':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{property.title}</CardTitle>
            <p className="text-xs text-gray-500 mt-1">{property.propertyUid}</p>
          </div>
          <Badge className={getStatusColor(property.status)}>
            {property.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-start space-x-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{property.address}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Square className="h-4 w-4 text-gray-400" />
            <span>{property.area} m²</span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-gray-400" />
            <span>{property.documents.length} docs</span>
          </div>
        </div>

        {property.price && (
          <div className="pt-2 border-t">
            <p className="text-sm text-gray-500">Price</p>
            <p className="text-xl text-blue-600">
              ${property.price.toLocaleString()}
            </p>
          </div>
        )}

        <div className="text-xs text-gray-500">
          Owner: {property.ownerName}
        </div>
      </CardContent>

      <CardFooter className="flex space-x-2">
        <Button variant="outline" className="flex-1" onClick={() => onView(property)}>
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
        {actionButton}
      </CardFooter>
    </Card>
  );
}
