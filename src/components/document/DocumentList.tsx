
import { Document } from "@/lib/types";
import { DocumentCard } from "./DocumentCard";

interface DocumentListProps {
  documents: Document[];
  isLoading: boolean;
  onDeleteDocument: (e: React.MouseEvent, documentId: string) => void;
  onSelectDocument: (documentId: string) => void;
  isDesigner?: boolean;
  showStatus?: boolean;
  onToggleStatus?: (documentId: string, currentStatus: string) => void;
}

export const DocumentList = ({ 
  documents, 
  isLoading, 
  onDeleteDocument, 
  onSelectDocument,
  isDesigner = false,
  showStatus = false,
  onToggleStatus
}: DocumentListProps) => {
  const itemType = isDesigner ? "template" : "document";
  const itemTypePlural = isDesigner ? "templates" : "documents";
  
  if (isLoading) {
    return <p className="text-editor-text text-center py-12">Loading your {itemTypePlural}...</p>;
  }

  if (documents.length === 0) {
    return <p className="text-editor-text text-center py-12">No {itemTypePlural} found. Create your first {itemType}!</p>;
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
          onDelete={onDeleteDocument}
          onSelect={onSelectDocument}
          isDesigner={isDesigner}
          showStatus={showStatus}
          status={doc.meta?.status}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
};
