
import { useState, useEffect } from "react";
import { Document } from "@/lib/types";

export const useFilteredDocuments = (documents: Document[], searchQuery: string = "", activeTab: string = "all") => {
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  
  useEffect(() => {
    // Filter documents based on the active tab
    let result = documents;
    
    if (activeTab === 'all') {
      // No additional filtering for 'all' tab
    } else if (activeTab === 'recent') {
      result = documents
        .sort((a, b) => {
          const dateA = a.updated_at || a.created_at || '';
          const dateB = b.updated_at || b.created_at || '';
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        })
        .slice(0, 5);
    } else if (activeTab === 'shared') {
      // In a real app, we would filter by shared documents
      result = [];
    }
    
    setFilteredDocuments(result);
  }, [documents, activeTab, searchQuery]);
  
  return {
    filteredDocuments,
  };
};
