
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useNavigationHandlers } from "@/hooks/navigation/useNavigationHandlers";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar = ({ 
  onSearch, 
  placeholder = "Search documents...", 
  className = "" 
}: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const { navigateTo } = useNavigationHandlers();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      // Default behavior: navigate to search results page
      navigateTo(`/search?q=${encodeURIComponent(query)}`);
    }
  };
  
  const clearSearch = () => {
    setQuery("");
  };
  
  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-9 pr-10"
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
