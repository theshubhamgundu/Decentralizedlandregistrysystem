import React from 'react';
import { Property } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { MapPin, Square, Calendar, User, FileText, Download } from 'lucide-react';
import { Button } from './ui/button';

interface PropertyDetailsDialogProps {
  property: Property | null;
  open: boolean;
  onClose: () => void;
  actionButton?: React.ReactNode;
}

export function PropertyDetailsDialog({
  property,
  open,
  onClose,
  actionButton,
}: PropertyDetailsDialogProps) {
  if (!property) return null;

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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle>{property.title}</DialogTitle>
              <DialogDescription>{property.propertyUid}</DialogDescription>
            </div>
            <Badge className={getStatusColor(property.status)}>
              {property.status.replace('_', ' ')}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Price */}
          {property.price && (
            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p className="text-3xl text-blue-600">
                ${property.price.toLocaleString()}
              </p>
            </div>
          )}

          <Separator />

          {/* Property Details */}
          <div className="space-y-4">
            <h3 className="font-semibold">Property Details</h3>
            
            <div className="grid gap-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p>{property.address}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Square className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Area</p>
                  <p>{property.area} m²</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Current Owner</p>
                  <p>{property.ownerName}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Registered On</p>
                  <p>{new Date(property.registeredAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{property.description}</p>
          </div>

          <Separator />

          {/* Documents */}
          <div>
            <h3 className="font-semibold mb-3">Documents ({property.documents.length})</h3>
            {property.documents.length > 0 ? (
              <div className="space-y-2">
                {property.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm">{doc.fileName}</p>
                        <p className="text-xs text-gray-500">
                          Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No documents uploaded</p>
            )}
          </div>

          {/* Action Button */}
          {actionButton && (
            <>
              <Separator />
              <div>{actionButton}</div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
