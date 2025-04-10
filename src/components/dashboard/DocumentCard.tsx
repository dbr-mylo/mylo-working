
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Document } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

interface DocumentCardProps {
  document: Document;
  isTemplate?: boolean;
  onClick?: () => void;
}

export const DocumentCard = ({ 
  document, 
  isTemplate = false,
  onClick 
}: DocumentCardProps) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'draft':
        return 'bg-amber-100 text-amber-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'published':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" 
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{document.title}</CardTitle>
            <CardDescription>
              {document.updated_at && (
                <>
                  Updated {formatDistanceToNow(new Date(document.updated_at), { addSuffix: true })}
                </>
              )}
            </CardDescription>
          </div>
          <Badge className={`${getStatusColor(document.status || 'draft')}`}>
            {document.status || 'Draft'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-16 overflow-hidden text-sm text-gray-600">
          {document.content ? (
            document.content.substring(0, 80) + (document.content.length > 80 ? '...' : '')
          ) : (
            <span className="italic text-gray-400">
              {isTemplate ? 'Empty template' : 'Empty document'}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 text-xs text-gray-500 py-2">
        {isTemplate ? 'Template' : 'Document'} ID: {document.id.substring(0, 8)}
      </CardFooter>
    </Card>
  );
};
