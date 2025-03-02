import { useEffect } from "react";
import type { Document, UseDocumentReturn } from "@/lib/types";
import { useDocumentState } from "./document/useDocumentState";
import { useDocumentFetch } from "./document/useDocumentFetch";
import { useDocumentSave } from "./document/useDocumentSave";
import { useDocumentLoad } from "./document/useDocumentLoad";

export function useDocument(documentId: string | undefined): UseDocumentReturn {
  const {
    content,
    setContent,
    initialContent,
    setInitialContent,
    documentTitle,
    setDocumentTitle,
    currentDocumentId,
    setCurrentDocumentId,
    isLoading,
    setIsLoading
  } = useDocumentState();

  const { fetchDocument } = useDocumentFetch(
    documentId,
    setContent,
    setInitialContent,
    setDocumentTitle,
    setCurrentDocumentId,
    setIsLoading
  );

  const { saveDocument } = useDocumentSave(
    content,
    documentTitle,
    currentDocumentId,
    setInitialContent,
    setCurrentDocumentId
  );

  const { loadDocument } = useDocumentLoad(
    setContent,
    setInitialContent,
    setDocumentTitle,
    setCurrentDocumentId
  );

  useEffect(() => {
    console.log("Content updated in useDocument hook:", content ? content.substring(0, 100) : "empty");
    console.log("Content length:", content ? content.length : 0);
  }, [content]);

  return {
    content,
    setContent,
    initialContent,
    documentTitle,
    setDocumentTitle,
    currentDocumentId,
    isLoading,
    saveDocument,
    loadDocument
  };
}
