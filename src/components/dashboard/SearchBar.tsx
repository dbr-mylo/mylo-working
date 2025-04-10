
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useNavigationHandlers } from "@/hooks/navigation/useNavigationHandlers";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  initialQuery?: string;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export const SearchBar = ({ 
  onSearch, 
  initialQuery = "",
  placeholder = "Search documents...", 
  className = "",
  autoFocus = false
}: SearchBarProps) => {
  const [query, setQuery] = useState(initialQuery);
  const { navigateTo } = useNavigationHandlers();
  
  // Update local state when initialQuery changes
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      // Default behavior: navigate to search results page
      navigateTo(`/search?q=${encodeURIComponent(query)}`);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    // If debounced search is needed, handle here
    if (onSearch) {
      onSearch(newQuery);
    }
  };
  
  const clearSearch = () => {
    setQuery("");
    if (onSearch) {
      onSearch("");
    }
  };
  
  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="pl-9 pr-10"
        autoFocus={autoFocus}
      />
      {query && (
        <button 
          type="button" 
          onClick={clearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      )}
    </form>
  );
};
