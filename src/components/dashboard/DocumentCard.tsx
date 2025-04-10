
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Document } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocumentCardProps {
  document: Document;
  isTemplate?: boolean;
  onClick?: () => void;
  onDelete?: (e: React.MouseEvent, documentId: string) => void;
  onSelect?: (documentId: string) => void;
  showStatus?: boolean;
  status?: string;
  isDesigner?: boolean;
  onToggleStatus?: (documentId: string, currentStatus: string) => void;
  viewMode?: "grid" | "list";
}

export const DocumentCard = ({ 
  document, 
  isTemplate = false,
  onClick,
  onDelete,
  onSelect,
  showStatus = false,
  status,
  isDesigner = false,
  onToggleStatus,
  viewMode = "grid"
}: DocumentCardProps) => {
  const getStatusColor = (status: string | undefined) => {
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

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (onSelect) {
      onSelect(document.id);
    }
  };
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(e, document.id);
    }
  };
  
  const handleToggleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleStatus) {
      const currentStatus = document.status || 'draft';
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      onToggleStatus(document.id, currentStatus);
    }
  };
  
  if (viewMode === "list") {
    return (
      <div 
        className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{document.title}</h3>
            {showStatus && document.status && (
              <Badge className={`${getStatusColor(document.status)} text-xs`}>
                {document.status}
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-500">
            {document.updated_at && formatDistanceToNow(new Date(document.updated_at), { addSuffix: true })}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); if (onSelect) onSelect(document.id); }}>
                <Edit className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
              {isDesigner && onToggleStatus && (
                <DropdownMenuItem onClick={handleToggleStatus}>
                  {document.status === 'published' ? 'Unpublish' : 'Publish'}
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem onClick={handleDeleteClick} className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }
  
  // Default grid view
  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" 
      onClick={handleClick}
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
          {showStatus && document.status && (
            <Badge className={`${getStatusColor(document.status)}`}>
              {document.status}
            </Badge>
          )}
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
      <CardFooter className="bg-gray-50 text-xs text-gray-500 py-2 flex justify-between">
        <span>{isTemplate ? 'Template' : 'Document'} ID: {document.id.substring(0, 8)}</span>
        
        <div className="flex gap-1">
          {isDesigner && onToggleStatus && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs"
              onClick={handleToggleStatus}
            >
              {document.status === 'published' ? 'Unpublish' : 'Publish'}
            </Button>
          )}
          
          {onDelete && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleDeleteClick}
            >
              Delete
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
