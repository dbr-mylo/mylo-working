
import { useState, useEffect, useMemo } from 'react';
import { Document } from "@/lib/types";
import { SortOption, FilterOption } from "@/components/dashboard/DocumentFilters";

export const useDocumentFiltering = (documents: Document[], projectId?: string | null) => {
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter documents
  const filteredDocuments = useMemo(() => {
    let result = [...documents];
    
    // Filter by project if specified
    if (projectId) {
      result = result.filter(doc => doc.meta?.project_id === projectId);
    }
    
    // Apply type/status filter
    switch (filterBy) {
      case "documents":
        result = result.filter(doc => !doc.meta?.template_id);
        break;
      case "templates":
        result = result.filter(doc => doc.meta?.isTemplate === true);
        break;
      case "completed":
        result = result.filter(doc => doc.status === "completed");
        break;
      case "draft":
        result = result.filter(doc => doc.status === "draft");
        break;
      case "all":
      default:
        // No filtering needed
        break;
    }
    
    // Apply search filter if query exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(doc => 
        doc.title.toLowerCase().includes(query) || 
        (doc.content && doc.content.toLowerCase().includes(query))
      );
    }
    
    return result;
  }, [documents, filterBy, searchQuery, projectId]);
  
  // Sort filtered documents
  const sortedDocuments = useMemo(() => {
    const sorted = [...filteredDocuments];
    
    switch (sortBy) {
      case "newest":
        return sorted.sort((a, b) => 
          new Date(b.created_at || b.updated_at).getTime() - 
          new Date(a.created_at || a.updated_at).getTime()
        );
      case "oldest":
        return sorted.sort((a, b) => 
          new Date(a.created_at || a.updated_at).getTime() - 
          new Date(b.created_at || b.updated_at).getTime()
        );
      case "recently-edited":
        return sorted.sort((a, b) => 
          new Date(b.updated_at).getTime() - 
          new Date(a.updated_at).getTime()
        );
      case "a-z":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "z-a":
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sorted;
    }
  }, [filteredDocuments, sortBy]);
  
  return {
    sortBy,
    filterBy,
    searchQuery,
    setSortBy,
    setFilterBy,
    setSearchQuery,
    filteredDocuments: sortedDocuments
  };
};
