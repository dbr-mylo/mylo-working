
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, FileEdit, EyeOff, Eye, Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Document } from "@/lib/types";

interface DocumentCardProps {
  document: Document;
  onDelete: (e: React.MouseEvent, documentId: string) => void;
  onSelect: (documentId: string) => void;
  isDesigner?: boolean;
  showStatus?: boolean;
  status?: string;
  onToggleStatus?: (documentId: string, currentStatus: string) => void;
}

export const DocumentCard = ({ 
  document, 
  onDelete, 
  onSelect,
  isDesigner = false,
  showStatus = false,
  status = 'draft',
  onToggleStatus
}: DocumentCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const buttonSize = isDesigner ? "xs" : "icon";
  const isPublished = status === 'published';
  
  const handleStatusToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleStatus) {
      onToggleStatus(document.id, status || 'draft');
    }
  };
  
  return (
    <Card 
      key={document.id} 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer w-full"
      onClick={() => onSelect(document.id)}
    >
      <CardHeader className="p-3">
        <div className="flex justify-between items-center gap-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <CardTitle className="text-md break-words overflow-hidden">{document.title}</CardTitle>
              
              {showStatus && (
                <Badge 
                  variant={isPublished ? "success" : "outline"}
                  className={isPublished ? "bg-green-500 hover:bg-green-600" : "text-gray-500"}
                >
                  {isPublished ? "Published" : "Draft"}
                </Badge>
              )}
            </div>
            <span className="text-xs text-gray-500">
              {formatDate(document.updated_at)}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {document.meta?.owner_id && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size={buttonSize}
                      className="h-7 w-7 p-0 text-gray-500"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Owner ID: {document.meta.owner_id}</p>
                    {document.meta.version && <p>Version: {document.meta.version}</p>}
                    {document.meta.category && <p>Category: {document.meta.category}</p>}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          
            {onToggleStatus && (
              <Button
                variant="ghost"
                size={buttonSize}
                className={buttonSize === "xs" ? "h-7 w-7 p-0 text-gray-500 hover:bg-blue-100 hover:text-blue-600" : "h-8 w-8 text-gray-500 hover:bg-blue-100 hover:text-blue-600"}
                onClick={handleStatusToggle}
                title={isPublished ? "Unpublish template" : "Publish template"}
              >
                {isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            )}
              
            {isDesigner && (
              <Button
                variant="ghost"
                size={buttonSize}
                className={buttonSize === "xs" ? "h-7 w-7 p-0 text-gray-500 hover:bg-blue-100 hover:text-blue-600" : "h-8 w-8 text-gray-500 hover:bg-blue-100 hover:text-blue-600"}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(document.id);
                }}
                title="Edit template"
              >
                <FileEdit className="h-4 w-4" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size={buttonSize} 
              className={buttonSize === "xs" ? "h-7 w-7 p-0 text-gray-500 hover:bg-red-100 hover:text-red-600" : "h-8 w-8 text-gray-500 hover:bg-red-100 hover:text-red-600"}
              onClick={(e) => onDelete(e, document.id)}
              title={`Delete ${isDesigner ? "template" : "document"}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
