
import { loadDocument as loadDocumentUtil } from "@/utils/documentFetchUtils";
import type { Document } from "@/lib/types";

export function useDocumentLoad(
  setContent: (content: string) => void,
  setInitialContent: (content: string) => void,
  setDocumentTitle: (title: string) => void,
  setCurrentDocumentId: (id: string | null) => void
) {
  const loadDocument = (doc: Document) => {
    console.log("Loading document:", doc.id);
    console.log("Content length from document:", doc.content ? doc.content.length : 0);
    console.log("Content preview:", doc.content ? doc.content.substring(0, 100) : "empty");
    
    const loadedDoc = loadDocumentUtil(doc);
    
    console.log("Processed content length:", loadedDoc.content ? loadedDoc.content.length : 0);
    console.log("Processed content preview:", loadedDoc.content ? loadedDoc.content.substring(0, 100) : "empty");
    
    setContent(loadedDoc.content);
    setInitialContent(loadedDoc.initialContent);
    setDocumentTitle(loadedDoc.documentTitle);
    setCurrentDocumentId(loadedDoc.currentDocumentId);
    
    // Verify content is set correctly
    setTimeout(() => {
      console.log("Verification - content after setting:", loadedDoc.content);
    }, 100);
  };

  return { loadDocument };
}
