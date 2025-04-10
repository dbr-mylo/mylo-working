
import React, { useEffect } from "react";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { SearchResults } from "@/components/search/SearchResults";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/contexts/search/SearchContext";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useAnalytics } from "@/hooks/analytics/useAnalytics";

interface DashboardSearchProps {
  className?: string;
}

export const DashboardSearch: React.FC<DashboardSearchProps> = ({ className = "" }) => {
  const { searchQuery, setSearchQuery, performSearch, clearSearch, searchResults } = useSearch();
  const navigate = useNavigate();
  const { trackSearch } = useAnalytics();
  
  // Perform search when query changes
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const delayDebounce = setTimeout(() => {
        performSearch();
        // Track search analytics
        trackSearch(searchQuery, searchResults.length);
      }, 300);
      
      return () => clearTimeout(delayDebounce);
    }
  }, [searchQuery, performSearch, trackSearch, searchResults.length]);
  
  const handleClearSearch = () => {
    clearSearch();
  };
  
  const handleDocumentSelect = (docId: string) => {
    navigate(`/editor/${docId}`);
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-lg">
          <SearchBar 
            onSearch={setSearchQuery} 
            initialQuery={searchQuery} 
            placeholder="Search documents, templates, and projects..."
          />
        </div>
        
        {searchQuery && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearSearch}
            className="ml-2"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
      
      {searchQuery && (
        <div>
          <h2 className="text-lg font-medium mb-3">
            Search results for "{searchQuery}"
          </h2>
          <SearchResults onDocumentSelect={handleDocumentSelect} />
        </div>
      )}
    </div>
  );
};
