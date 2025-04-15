
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Copy, Plus, Trash } from 'lucide-react';
import { generateDeepLink } from './utils/parameterTestUtils';

export const DeepLinkTester: React.FC = () => {
  const { toast } = useToast();
  const [basePath, setBasePath] = useState('/content/:type/:id');
  const [params, setParams] = useState([{ key: 'type', value: 'article' }, { key: 'id', value: '123' }]);
  const [queryParams, setQueryParams] = useState([{ key: 'mode', value: 'edit' }]);
  const [generatedLink, setGeneratedLink] = useState('');
  const [testHistory, setTestHistory] = useState<{ 
    basePath: string; 
    params: { key: string; value: string }[];
    queryParams: { key: string; value: string }[];
    result: string;
    timestamp: string;
  }[]>([]);

  const generateLink = () => {
    try {
      // Convert params array to object
      const paramsObj = params.reduce((obj, item) => {
        obj[item.key] = item.value;
        return obj;
      }, {} as Record<string, string>);
      
      // Convert query params array to object
      const queryObj = queryParams.reduce((obj, item) => {
        obj[item.key] = item.value;
        return obj;
      }, {} as Record<string, string>);
      
      // Generate the link
      const link = generateDeepLink(basePath, paramsObj, queryObj);
      
      setGeneratedLink(link);
      
      // Add to history
      setTestHistory(prev => [{
        basePath,
        params: [...params],
        queryParams: [...queryParams],
        result: link,
        timestamp: new Date().toISOString()
      }, ...prev]);
      
      toast({
        title: 'Deep link generated',
        description: 'Link successfully generated with parameters',
      });
    } catch (error) {
      toast({
        title: 'Error generating deep link',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    toast({
      title: 'Copied to clipboard',
      description: 'Deep link copied to clipboard',
    });
  };
  
  const addParam = () => {
    setParams([...params, { key: '', value: '' }]);
  };
  
  const updateParam = (index: number, field: 'key' | 'value', value: string) => {
    const newParams = [...params];
    newParams[index][field] = value;
    setParams(newParams);
  };
  
  const removeParam = (index: number) => {
    setParams(params.filter((_, i) => i !== index));
  };
  
  const addQueryParam = () => {
    setQueryParams([...queryParams, { key: '', value: '' }]);
  };
  
  const updateQueryParam = (index: number, field: 'key' | 'value', value: string) => {
    const newQueryParams = [...queryParams];
    newQueryParams[index][field] = value;
    setQueryParams(newQueryParams);
  };
  
  const removeQueryParam = (index: number) => {
    setQueryParams(queryParams.filter((_, i) => i !== index));
  };
  
  const loadFromHistory = (historyItem: typeof testHistory[0]) => {
    setBasePath(historyItem.basePath);
    setParams([...historyItem.params]);
    setQueryParams([...historyItem.queryParams]);
    setGeneratedLink(historyItem.result);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Deep Link Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Base Path Pattern</label>
            <Input 
              value={basePath}
              onChange={(e) => setBasePath(e.target.value)}
              placeholder="/user/:id"
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              The route pattern with parameter placeholders (e.g., /content/:type/:id)
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Path Parameters</label>
              <Button variant="outline" size="sm" onClick={addParam}>
                <Plus className="h-4 w-4 mr-1" /> Add Parameter
              </Button>
            </div>
            
            {params.map((param, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  placeholder="Parameter name"
                  value={param.key}
                  onChange={(e) => updateParam(index, 'key', e.target.value)}
                  className="w-1/3"
                />
                <Input
                  placeholder="Parameter value"
                  value={param.value}
                  onChange={(e) => updateParam(index, 'value', e.target.value)}
                />
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => removeParam(index)}
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Query Parameters</label>
              <Button variant="outline" size="sm" onClick={addQueryParam}>
                <Plus className="h-4 w-4 mr-1" /> Add Query Parameter
              </Button>
            </div>
            
            {queryParams.map((param, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  placeholder="Parameter name"
                  value={param.key}
                  onChange={(e) => updateQueryParam(index, 'key', e.target.value)}
                  className="w-1/3"
                />
                <Input
                  placeholder="Parameter value"
                  value={param.value}
                  onChange={(e) => updateQueryParam(index, 'value', e.target.value)}
                />
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => removeQueryParam(index)}
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
          
          <Button onClick={generateLink} className="w-full">Generate Deep Link</Button>
          
          {generatedLink && (
            <div className="border rounded-md p-4 space-y-2 bg-muted/50">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Generated Link</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4 mr-1" /> Copy
                </Button>
              </div>
              <div className="bg-background p-3 rounded-md break-words">
                <code className="text-sm">{generatedLink}</code>
              </div>
            </div>
          )}
          
          {testHistory.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">History</h3>
              <div className="border rounded-md overflow-auto max-h-60">
                {testHistory.map((item, index) => (
                  <div 
                    key={index} 
                    className="border-b p-3 hover:bg-muted/50 cursor-pointer flex justify-between items-center"
                    onClick={() => loadFromHistory(item)}
                  >
                    <div className="space-y-1">
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {item.params.length} params
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {item.queryParams.length} query
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate max-w-[500px]">{item.result}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
