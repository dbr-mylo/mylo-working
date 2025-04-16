
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdvancedDeepLinking } from '@/hooks/useAdvancedDeepLinking';
import { useToast } from '@/hooks/use-toast';

export const DeepLinkingExamples: React.FC = () => {
  const { toast } = useToast();
  const { 
    createLink, 
    navigateToDeepLink, 
    getCurrentParameters,
    updateComplexQueryParams,
    parseDeepLink
  } = useAdvancedDeepLinking();
  
  const [generatedLink, setGeneratedLink] = useState('');
  const [currentParameters, setCurrentParameters] = useState<{
    pathParams: Record<string, any>;
    queryParams: Record<string, any>;
  }>({ pathParams: {}, queryParams: {} });
  
  // Update current parameters when the component mounts
  useEffect(() => {
    const params = getCurrentParameters();
    setCurrentParameters(params);
  }, [getCurrentParameters]);
  
  // Example 1: Basic deep linking
  const generateBasicLink = () => {
    const link = createLink(
      '/content/:type/:id',
      { type: 'article', id: '123' },
      { mode: 'edit', version: 2 }
    );
    setGeneratedLink(link);
  };
  
  // Example 2: Complex parameter linking
  const generateComplexLink = () => {
    const link = createLink(
      '/search/:category',
      { category: 'products' },
      { 
        filters: {
          price: { min: 10, max: 100 },
          brand: ['apple', 'samsung'],
          inStock: true
        },
        sort: ['price', 'asc'],
        page: 1
      }
    );
    setGeneratedLink(link);
  };
  
  // Example 3: Navigate to a deep link
  const navigateExample = () => {
    const success = navigateToDeepLink(
      '/content/:type/:id',
      { type: 'document', id: '456' },
      { view: 'preview', highlight: ['intro', 'summary'] }
    );
    
    if (success) {
      toast({
        title: 'Navigation successful',
        description: 'Navigated to content document with parameters',
      });
    }
  };
  
  // Example 4: Update query parameters
  const updateParameters = () => {
    updateComplexQueryParams({
      theme: 'dark',
      preferences: { fontSize: 16, showToolbar: true }
    });
    
    // Update our local state with the new parameters
    setTimeout(() => {
      const params = getCurrentParameters();
      setCurrentParameters(params);
      
      toast({
        title: 'Parameters updated',
        description: 'Query parameters have been updated',
      });
    }, 100);
  };
  
  // Example 5: Parse a complex link
  const parseExample = () => {
    if (!generatedLink) {
      toast({
        title: 'No link to parse',
        description: 'Please generate a link first',
        variant: 'destructive',
      });
      return;
    }
    
    const parsed = parseDeepLink(generatedLink);
    console.log('Parsed link:', parsed);
    
    toast({
      title: 'Link parsed',
      description: `Found ${Object.keys(parsed.queryParams).length} query parameters`,
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deep Linking Examples</CardTitle>
        <CardDescription>
          Examples of using the advanced deep linking hooks and utilities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button onClick={generateBasicLink}>
            Generate Basic Link
          </Button>
          <Button onClick={generateComplexLink}>
            Generate Complex Link
          </Button>
          <Button onClick={navigateExample}>
            Navigate to Example
          </Button>
          <Button onClick={updateParameters}>
            Update Query Parameters
          </Button>
        </div>
        
        {generatedLink && (
          <div className="p-4 border rounded-md bg-muted/30">
            <div className="text-sm font-medium mb-2">Generated Link:</div>
            <div className="font-mono text-sm break-all">
              {generatedLink}
            </div>
            <div className="mt-2 flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  navigator.clipboard.writeText(generatedLink);
                  toast({ title: 'Copied to clipboard' });
                }}
              >
                Copy
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2"
                onClick={parseExample}
              >
                Parse
              </Button>
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <div className="text-sm font-medium">Current Parameters:</div>
          <div className="p-4 border rounded-md bg-muted/30">
            <div className="mb-2">
              <span className="font-medium">Path Parameters:</span>
              <pre className="text-xs overflow-auto mt-1">
                {JSON.stringify(currentParameters.pathParams, null, 2)}
              </pre>
            </div>
            <div>
              <span className="font-medium">Query Parameters:</span>
              <pre className="text-xs overflow-auto mt-1">
                {JSON.stringify(currentParameters.queryParams, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={() => {
            const params = getCurrentParameters();
            setCurrentParameters(params);
            toast({ title: 'Parameters refreshed' });
          }}
        >
          Refresh Parameters
        </Button>
      </CardFooter>
    </Card>
  );
};
