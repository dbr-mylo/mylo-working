
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
        <div className="flex items-center">
          <div className="mr-4">
            {isTemplate ? 
              <div className="h-10 w-10 rounded bg-blue-100 flex items-center justify-center">
                <Edit className="h-5 w-5 text-blue-600" />
              </div> :
              <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                <Edit className="h-5 w-5 text-gray-600" />
              </div>
            }
          </div>
          <div>
            <h3 className="font-medium">{document.title || "Untitled"}</h3>
            <p className="text-sm text-gray-500">
              {document.updated_at && `Updated ${formatDistanceToNow(new Date(document.updated_at), { addSuffix: true })}`}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          {showStatus && status && (
            <Badge className={`mr-3 ${getStatusColor(status)}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleClick}>
                Open
              </DropdownMenuItem>
              {onDelete && (
                <DropdownMenuItem onClick={handleDeleteClick} className="text-red-600">
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }
  
  // Grid mode (default)
  return (
    <Card 
      className="overflow-hidden hover:border-blue-300 transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between">
          <CardTitle className="text-lg truncate">{document.title || "Untitled"}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleClick}>
                Open
              </DropdownMenuItem>
              {onDelete && (
                <DropdownMenuItem onClick={handleDeleteClick} className="text-red-600">
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="text-sm">
          {document.updated_at && `Updated ${formatDistanceToNow(new Date(document.updated_at), { addSuffix: true })}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-24 bg-gray-50 rounded border flex items-center justify-center mb-2">
          {document.content ? (
            <div className="w-full h-full p-2 overflow-hidden text-xs text-gray-600">
              {document.content.substring(0, 100)}...
            </div>
          ) : (
            <div className="text-gray-400 text-sm">No content</div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        {showStatus && status && (
          <Badge className={getStatusColor(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )}
        {onDelete && (
          <Button variant="outline" size="sm" onClick={handleDeleteClick} className="ml-auto">
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
