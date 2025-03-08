
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, FileEdit } from "lucide-react";
import type { Document } from "@/lib/types";

interface DocumentCardProps {
  document: Document;
  onDelete: (e: React.MouseEvent, documentId: string) => void;
  onSelect: (documentId: string) => void;
  isDesigner?: boolean;
}

export const DocumentCard = ({ 
  document, 
  onDelete, 
  onSelect,
  isDesigner = false
}: DocumentCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const buttonSize = isDesigner ? "xs" : "icon";
  
  return (
    <Card 
      key={document.id} 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer w-full"
      onClick={() => onSelect(document.id)}
    >
      <CardHeader className="p-3">
        <div className="flex justify-between items-center gap-2">
          <div className="flex flex-col">
            <CardTitle className="text-md break-words overflow-hidden">{document.title}</CardTitle>
            <span className="text-xs text-gray-500">
              {formatDate(document.updated_at)}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
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
