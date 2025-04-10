
import React, { createContext, useContext, useState, useCallback } from 'react';
import { SearchQuery, SearchFilters, SortOption } from '@/lib/types';

interface SearchContextType {
  searchQuery: string;
  filters: SearchFilters;
  sortOption: SortOption;
  searchResults: any[];
  isSearching: boolean;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: SearchFilters) => void;
  setSortOption: (option: SortOption) => void;
  performSearch: () => Promise<void>;
  clearSearch: () => void;
}

const defaultSort: SortOption = {
  field: 'updatedAt',
  direction: 'desc'
};

const defaultFilters: SearchFilters = {
  documentType: 'all',
  status: [],
  tags: []
};

const SearchContext = createContext<SearchContextType>({
  searchQuery: '',
  filters: defaultFilters,
  sortOption: defaultSort,
  searchResults: [],
  isSearching: false,
  setSearchQuery: () => {},
  setFilters: () => {},
  setSortOption: () => {},
  performSearch: async () => {},
  clearSearch: () => {}
});

export const useSearch = () => useContext(SearchContext);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [sortOption, setSortOption] = useState<SortOption>(defaultSort);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const performSearch = useCallback(async () => {
    setIsSearching(true);
    
    try {
      // This would be replaced with an actual API call in a production environment
      // For now, we'll simulate a search with a timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock search results based on the query
      const mockResults = [
        { id: 'doc-1', title: 'Marketing Strategy', type: 'document', updatedAt: new Date().toISOString() },
        { id: 'doc-2', title: 'Product Roadmap', type: 'document', updatedAt: new Date().toISOString() },
        { id: 'template-1', title: 'Press Release', type: 'template', updatedAt: new Date().toISOString() },
      ].filter(item => 
        searchQuery ? item.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
      );
      
      setSearchResults(mockResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, filters, sortOption]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setFilters(defaultFilters);
    setSortOption(defaultSort);
    setSearchResults([]);
  }, []);

  const value = {
    searchQuery,
    filters,
    sortOption,
    searchResults,
    isSearching,
    setSearchQuery,
    setFilters,
    setSortOption,
    performSearch,
    clearSearch
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};
