
import { useState, useEffect } from "react";
import type { Document } from "@/lib/types";

export function useDocumentState() {
  const [content, setContent] = useState("");
  const [initialContent, setInitialContent] = useState("");
  const [documentTitle, setDocumentTitle] = useState("");
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Debug log whenever content changes
  useEffect(() => {
    console.log("Content updated in document state hook:", content ? content.substring(0, 100) : "empty");
    console.log("Content length:", content ? content.length : 0);
  }, [content]);

  return {
    content,
    setContent,
    initialContent,
    setInitialContent,
    documentTitle,
    setDocumentTitle,
    currentDocumentId,
    setCurrentDocumentId,
    isLoading,
    setIsLoading,
  };
}
