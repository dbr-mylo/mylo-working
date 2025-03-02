
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import type { Document } from "@/lib/types";

interface DocumentCardProps {
  document: Document;
  onDelete: (e: React.MouseEvent, documentId: string) => void;
  onSelect: (documentId: string) => void;
}

export const DocumentCard = ({ document, onDelete, onSelect }: DocumentCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card 
      key={document.id} 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer w-full"
      onClick={() => onSelect(document.id)}
    >
      <CardHeader className="p-3">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <CardTitle className="text-md break-words">{document.title}</CardTitle>
          <div className="flex items-center gap-3 ml-auto">
            <div className="text-xs text-gray-500 self-center">
              {formatDate(document.updated_at)}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-gray-500 hover:bg-red-100 hover:text-red-600"
              onClick={(e) => onDelete(e, document.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
