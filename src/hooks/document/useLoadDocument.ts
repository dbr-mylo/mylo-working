
import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Document, DocumentMeta } from "@/lib/types";
import { loadDocument as loadDocumentUtil } from "@/utils/documentFetchUtils";

interface UseLoadDocumentProps {
  setContent: (content: string) => void;
  setInitialContent: (content: string) => void;
  setDocumentTitle: (title: string) => void;
  setCurrentDocumentId: (id: string | null) => void;
  setDocumentMeta?: (meta: DocumentMeta | undefined) => void;
}

export function useLoadDocument({
  setContent,
  setInitialContent,
  setDocumentTitle,
  setCurrentDocumentId,
  setDocumentMeta
}: UseLoadDocumentProps) {
  const { role } = useAuth();
  const isDesigner = role === "designer";
  const itemType = isDesigner ? "template" : "document";

  const loadDocument = useCallback((doc: Document) => {
    console.log(`Loading ${itemType}:`, doc.id);
    console.log("Content length from document:", doc.content ? doc.content.length : 0);
    console.log("Content preview:", doc.content ? doc.content.substring(0, 100) : "empty");
    
    const loadedDoc = loadDocumentUtil(doc);
    
    console.log("Processed content length:", loadedDoc.content ? loadedDoc.content.length : 0);
    console.log("Processed content preview:", loadedDoc.content ? loadedDoc.content.substring(0, 100) : "empty");
    
    setContent(loadedDoc.content);
    setInitialContent(loadedDoc.initialContent);
    setDocumentTitle(loadedDoc.documentTitle);
    setCurrentDocumentId(loadedDoc.currentDocumentId);
    
    // Set document meta if available
    if (setDocumentMeta && doc.meta) {
      setDocumentMeta(doc.meta);
    }
    
    setTimeout(() => {
      console.log("Verification - content after setting:", loadedDoc.content.substring(0, 100));
    }, 100);
  }, [setContent, setInitialContent, setDocumentTitle, setCurrentDocumentId, setDocumentMeta, role]);

  return { loadDocument };
}
