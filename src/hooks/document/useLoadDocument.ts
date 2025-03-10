
import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Document } from "@/lib/types";
import { loadDocument as loadDocumentUtil } from "@/utils/documentFetchUtils";
import { TemplatePreferences } from "@/lib/types/preferences";

interface UseLoadDocumentProps {
  setContent: (content: string) => void;
  setInitialContent: (content: string) => void;
  setDocumentTitle: (title: string) => void;
  setCurrentDocumentId: (id: string | null) => void;
  setPreferences: (preferences: TemplatePreferences | null) => void;
}

export function useLoadDocument({
  setContent,
  setInitialContent,
  setDocumentTitle,
  setCurrentDocumentId,
  setPreferences
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
    setPreferences(loadedDoc.preferences);
    
    setTimeout(() => {
      console.log("Verification - content after setting:", loadedDoc.content.substring(0, 100));
    }, 100);
  }, [setContent, setInitialContent, setDocumentTitle, setCurrentDocumentId, setPreferences, role]);

  return { loadDocument };
}
