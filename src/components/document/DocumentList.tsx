
import { Document } from "@/lib/types";
import { DocumentCard } from "./DocumentCard";

interface DocumentListProps {
  documents: Document[];
  isLoading: boolean;
  onDeleteDocument: (e: React.MouseEvent, documentId: string) => void;
  onSelectDocument: (documentId: string) => void;
}

export const DocumentList = ({ 
  documents, 
  isLoading, 
  onDeleteDocument, 
  onSelectDocument 
}: DocumentListProps) => {
  if (isLoading) {
    return <p className="text-editor-text text-center py-12">Loading your documents...</p>;
  }

  if (documents.length === 0) {
    return <p className="text-editor-text text-center py-12">No documents found. Create your first document!</p>;
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
          onDelete={onDeleteDocument}
          onSelect={onSelectDocument}
        />
      ))}
    </div>
  );
};
