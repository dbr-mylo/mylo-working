
import { useState, useEffect } from "react";

export const useDocumentId = () => {
  const [documentId, setDocumentId] = useState<string | null>(null);
  
  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/editor\/([^\/]+)/);
    if (match && match[1]) {
      setDocumentId(match[1]);
    }
  }, []);
  
  return documentId;
};
