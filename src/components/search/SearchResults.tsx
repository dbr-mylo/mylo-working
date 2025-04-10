
import React from 'react';
import { useSearch } from '@/contexts/search/SearchContext';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { File, FileText, Clock, Tag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '@/hooks/analytics/useAnalytics';

interface SearchResultsProps {
  onDocumentSelect?: (docId: string) => void;
  className?: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  onDocumentSelect,
  className = '',
}) => {
  const { searchResults, isSearching, searchQuery } = useSearch();
  const navigate = useNavigate();
  const { trackDocumentAction } = useAnalytics();
  
  const handleDocumentSelect = (docId: string, docTitle?: string) => {
    trackDocumentAction('view', docId, docTitle);
    
    if (onDocumentSelect) {
      onDocumentSelect(docId);
    } else {
      navigate(`/editor/${docId}`);
    }
  };
  
  if (isSearching) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3].map((i) => (
          <Card key={`loading-${i}`}>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="pb-2">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter className="pt-0">
              <Skeleton className="h-4 w-1/3" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
  
  if (searchResults.length === 0) {
    return (
      <div className={`py-8 text-center ${className}`}>
        {searchQuery ? (
          <div className="space-y-2">
            <p className="text-lg font-medium">No results found</p>
            <p className="text-sm text-gray-500">
              No items match your search for "{searchQuery}"
            </p>
          </div>
        ) : (
          <p className="text-gray-500">Enter a search query to find documents and templates</p>
        )}
      </div>
    );
  }
  
  return (
    <div className={`space-y-4 ${className}`}>
      {searchResults.map((result) => (
        <Card key={result.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {result.type === 'template' ? (
                  <File className="h-4 w-4 text-blue-500" />
                ) : (
                  <FileText className="h-4 w-4 text-gray-500" />
                )}
                <h3 className="text-base font-medium">{result.title}</h3>
              </div>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                {result.type === 'template' ? 'Template' : 'Document'}
              </span>
            </div>
          </CardHeader>
          
          <CardContent className="pb-2 text-sm">
            {result.excerpt && (
              <p className="text-gray-600 line-clamp-2">{result.excerpt}</p>
            )}
            
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              {result.updatedAt && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>
                    {formatDistanceToNow(new Date(result.updatedAt), { addSuffix: true })}
                  </span>
                </div>
              )}
              
              {result.tags && result.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  <span>{result.tags.slice(0, 2).join(', ')}</span>
                  {result.tags.length > 2 && <span>+{result.tags.length - 2}</span>}
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="pt-0">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleDocumentSelect(result.id, result.title)}
              className="text-xs ml-auto"
            >
              Open {result.type === 'template' ? 'Template' : 'Document'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
