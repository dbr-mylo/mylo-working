
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { Document, UseDocumentReturn, DocumentMeta } from "@/lib/types";
import { useFetchDocument } from "./useFetchDocument";
import { useSaveDocument } from "./useSaveDocument";
import { useLoadDocument } from "./useLoadDocument";

export function useDocument(documentId: string | undefined): UseDocumentReturn {
  const [content, setContent] = useState("");
  const [initialContent, setInitialContent] = useState("");
  const [documentTitle, setDocumentTitle] = useState("");
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [documentMeta, setDocumentMeta] = useState<DocumentMeta | undefined>(undefined);
  const { user, role } = useAuth();
  const navigate = useNavigate();
  
  // Log content updates for debugging
  useEffect(() => {
    console.log("Content updated in useDocument hook:", content ? content.substring(0, 100) : "empty");
    console.log("Content length:", content ? content.length : 0);
  }, [content]);
  
  // Hook for fetching document functionality
  const { fetchDocument } = useFetchDocument({
    setContent,
    setInitialContent,
    setDocumentTitle,
    setCurrentDocumentId,
    setIsLoading,
    setDocumentMeta,
    user,
    role,
    navigate
  });
  
  // Hook for saving document functionality
  const { saveDocument } = useSaveDocument({
    content,
    currentDocumentId,
    documentTitle,
    documentMeta,
    user,
    role,
    setInitialContent,
    setCurrentDocumentId,
    navigate
  });
  
  // Hook for loading document functionality
  const { loadDocument } = useLoadDocument({
    setContent,
    setInitialContent,
    setDocumentTitle,
    setCurrentDocumentId,
    setDocumentMeta
  });

  // Fetch document when documentId changes
  useEffect(() => {
    if (documentId) {
      console.log("DocumentId changed, fetching document:", documentId);
      fetchDocument(documentId);
    } else {
      setContent("");
      setInitialContent("");
      setDocumentTitle("");
      setCurrentDocumentId(null);
      setDocumentMeta(undefined);
      setIsLoading(false);
    }
  }, [documentId, user, role, fetchDocument]);

  return {
    content,
    setContent,
    initialContent,
    documentTitle,
    setDocumentTitle,
    currentDocumentId,
    isLoading,
    saveDocument,
    loadDocument,
    documentMeta
  };
}
