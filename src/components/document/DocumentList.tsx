
import React, { useState } from "react";
import { Document } from "@/lib/types";
import { DocumentCard } from "@/components/dashboard/DocumentCard";
import { DocumentFilters, SortOption, FilterOption } from "@/components/dashboard/DocumentFilters";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { Grid2X2, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDocumentFiltering } from "@/hooks/dashboard/useDocumentFiltering";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface DocumentListProps {
  documents: Document[];
  isLoading: boolean;
  onDeleteDocument: (e: React.MouseEvent, documentId: string) => void;
  onSelectDocument: (documentId: string) => void;
  isDesigner?: boolean;
  showStatus?: boolean;
  onToggleStatus?: (documentId: string, currentStatus: string) => void;
  projectId?: string | null;
  className?: string;
}

export const DocumentList: React.FC<DocumentListProps> = ({ 
  documents, 
  isLoading, 
  onDeleteDocument, 
  onSelectDocument,
  isDesigner = false,
  showStatus = false,
  onToggleStatus,
  projectId,
  className = ""
}: DocumentListProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const itemType = isDesigner ? "template" : "document";
  const itemTypePlural = isDesigner ? "templates" : "documents";
  
  const {
    sortBy,
    filterBy,
    searchQuery,
    setSortBy,
    setFilterBy,
    setSearchQuery,
    filteredDocuments
  } = useDocumentFiltering(documents, projectId);
  
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex justify-between items-center mb-4">
          <SearchBar 
            onSearch={setSearchQuery} 
            className="w-full max-w-xs"
          />
          <div className="flex items-center space-x-2">
            <DocumentFilters
              sortBy={sortBy}
              filterBy={filterBy}
              onSortChange={setSortBy}
              onFilterChange={setFilterBy}
            />
            <div className="flex border rounded-md">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`px-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid2X2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`px-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-2"}>
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (filteredDocuments.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex justify-between items-center mb-4">
          <SearchBar 
            onSearch={setSearchQuery} 
            className="w-full max-w-xs"
          />
          <div className="flex items-center space-x-2">
            <DocumentFilters
              sortBy={sortBy}
              filterBy={filterBy}
              onSortChange={setSortBy}
              onFilterChange={setFilterBy}
            />
            <div className="flex border rounded-md">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`px-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid2X2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`px-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <p className="text-gray-500 mb-4">
              {searchQuery 
                ? `No ${itemTypePlural} found matching "${searchQuery}"` 
                : `No ${itemTypePlural} found`}
            </p>
            <Button onClick={() => onSelectDocument("new")}>
              Create Your First {itemType}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <SearchBar 
          onSearch={setSearchQuery} 
          className="w-full max-w-xs"
        />
        <div className="flex items-center space-x-2">
          <DocumentFilters
            sortBy={sortBy}
            filterBy={filterBy}
            onSortChange={setSortBy}
            onFilterChange={setFilterBy}
          />
          <div className="flex border rounded-md">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`px-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`px-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-2"}>
        {filteredDocuments.map((doc) => (
          <DocumentCard
            key={doc.id}
            document={doc}
            onDelete={onDeleteDocument}
            onSelect={onSelectDocument}
            isDesigner={isDesigner}
            showStatus={showStatus}
            status={doc.meta?.status}
            onToggleStatus={onToggleStatus}
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
};
