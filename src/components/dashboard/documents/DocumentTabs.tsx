
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DocumentList } from "@/components/document/DocumentList";
import { EmptyStatePrompt } from "@/components/dashboard/EmptyStatePrompt";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Document } from "@/lib/types";

interface DocumentTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  documents: Document[];
  filteredDocuments: Document[];
  documentsLoading: boolean;
  searchQuery: string;
  handleAddDocument: () => void;
  handleDeleteDocument: (e: React.MouseEvent, documentId: string) => void;
  handleSelectDocument: (documentId: string) => void;
  selectedProjectId: string | null;
}

export const DocumentTabs: React.FC<DocumentTabsProps> = ({
  activeTab,
  setActiveTab,
  documents,
  filteredDocuments,
  documentsLoading,
  searchQuery,
  handleAddDocument,
  handleDeleteDocument,
  handleSelectDocument,
  selectedProjectId,
}) => {
  // Check if we should show empty state
  const showEmptyState = !documentsLoading && documents.length === 0 && !searchQuery;
  const isSearching = searchQuery.trim().length > 0;

  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
      <div className="flex justify-between items-center mb-6">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="shared">Shared with me</TabsTrigger>
        </TabsList>
        
        <Button
          onClick={handleAddDocument}
          size="sm"
          className="ml-auto"
        >
          New Document
        </Button>
      </div>
      
      <TabsContent value="all" className="space-y-4">
        {showEmptyState ? (
          <EmptyStatePrompt
            title="No documents yet"
            description="Create your first document to get started"
            buttonText="Create Document"
            onClick={handleAddDocument}
          />
        ) : isSearching && filteredDocuments.length === 0 ? (
          <EmptyStatePrompt
            title="No results found"
            description={`No documents matching "${searchQuery}"`}
            buttonText="Clear Search"
            onClick={() => window.location.href = '/'}
          />
        ) : (
          <DocumentList
            documents={filteredDocuments}
            isLoading={documentsLoading}
            onDeleteDocument={handleDeleteDocument}
            onSelectDocument={handleSelectDocument}
            projectId={selectedProjectId}
          />
        )}
      </TabsContent>
      
      <TabsContent value="recent">
        <DocumentList
          documents={filteredDocuments}
          isLoading={documentsLoading}
          onDeleteDocument={handleDeleteDocument}
          onSelectDocument={handleSelectDocument}
        />
      </TabsContent>
      
      <TabsContent value="shared">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              Shared documents will appear here (coming soon)
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
