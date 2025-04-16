import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { generateDeepLink } from './utils/parameterTestUtils';
import { PathSegmentBuilder, PathSegment } from './components/PathSegmentBuilder';
import { QueryParameterBuilder } from './components/QueryParameterBuilder';
import { GeneratedLinkDisplay } from './components/GeneratedLinkDisplay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComplexParameterBuilder, ComplexParam } from './components/ComplexParameterBuilder';
import { createComplexDeepLink, parseComplexParameters } from './utils/complexParameterUtils';

export const DeepLinkTester: React.FC = () => {
  const { toast } = useToast();
  const [basePath, setBasePath] = useState('/content/:type/:id');
  const [params, setParams] = useState([{ key: 'type', value: 'article' }, { key: 'id', value: '123' }]);
  const [queryParams, setQueryParams] = useState([{ key: 'mode', value: 'edit' }]);
  const [generatedLink, setGeneratedLink] = useState('');
  const [segments, setSegments] = useState<PathSegment[]>([
    { type: 'static', name: '', value: 'content' },
    { type: 'param', name: 'contentType', value: 'article' }
  ]);
  
  const [complexParams, setComplexParams] = useState<ComplexParam[]>([
    { key: 'filters', type: 'array', value: '[1, 2, 3]' }
  ]);
  
  const [currentMode, setCurrentMode] = useState<'basic' | 'complex'>('basic');

  const generateLink = () => {
    try {
      if (currentMode === 'basic') {
        const paramsObj = params.reduce((obj, item) => {
          obj[item.key] = item.value;
          return obj;
        }, {} as Record<string, string>);
        
        const queryObj = queryParams.reduce((obj, item) => {
          obj[item.key] = item.value;
          return obj;
        }, {} as Record<string, string>);
        
        const link = generateDeepLink(basePath, paramsObj, queryObj);
        setGeneratedLink(link);
      } else {
        const paramsObj = params.reduce((obj, item) => {
          obj[item.key] = item.value;
          return obj;
        }, {} as Record<string, string>);
        
        const complexQueryObj = complexParams.reduce((obj, item) => {
          try {
            let value: any = item.value;
            
            if (item.type === 'array' || item.type === 'object') {
              value = JSON.parse(item.value);
            } else if (item.type === 'number') {
              value = Number(item.value);
            } else if (item.type === 'boolean') {
              value = item.value === 'true';
            }
            
            obj[item.key] = value;
          } catch (error) {
            console.error(`Error parsing ${item.type} value:`, error);
            obj[item.key] = item.value;
          }
          return obj;
        }, {} as Record<string, any>);
        
        const link = createComplexDeepLink(basePath, paramsObj, complexQueryObj);
        setGeneratedLink(link);
      }
      
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

  const parseLink = () => {
    if (!generatedLink) {
      toast({
        title: 'No link to parse',
        description: 'Please generate a link first',
        variant: 'destructive',
      });
      return;
    }

    try {
      const result = parseComplexParameters(generatedLink);
      
      toast({
        title: 'Link parsed successfully',
        description: `Found ${Object.keys(result.queryParams).length} query parameters`,
      });
      
      console.log('Parsed link:', result);
    } catch (error) {
      toast({
        title: 'Error parsing link',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const handleSegmentUpdate = (index: number, field: string, value: string) => {
    const newSegments = [...segments];
    if (field === 'type' && (value === 'static' || value === 'param')) {
      newSegments[index].type = value;
    } else if (field === 'name' || field === 'value') {
      (newSegments[index] as any)[field] = value;
    }
    setSegments(newSegments);
  };

  const handleSegmentRemove = (index: number) => {
    setSegments(segments.filter((_, i) => i !== index));
  };

  const handleAddSegment = (type: 'static' | 'param') => {
    setSegments([...segments, { type, name: '', value: '' }]);
  };

  const buildFromSegments = () => {
    let newBasePath = '';
    const newParams: { key: string; value: string }[] = [];

    segments.forEach(segment => {
      if (segment.type === 'static') {
        newBasePath += `/${segment.value}`;
      } else {
        newBasePath += `/:${segment.name}`;
        newParams.push({ key: segment.name, value: segment.value });
      }
    });

    setBasePath(newBasePath);
    setParams(newParams);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Deep Link Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" onValueChange={(value) => setCurrentMode(value as 'basic' | 'complex')}>
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Basic Parameters</TabsTrigger>
            <TabsTrigger value="complex">Complex Parameters</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Base Path Pattern</label>
              <Input 
                value={basePath}
                onChange={(e) => setBasePath(e.target.value)}
                placeholder="/user/:id"
                className="font-mono"
              />
            </div>
            
            <PathSegmentBuilder
              segments={segments}
              onSegmentUpdate={handleSegmentUpdate}
              onSegmentRemove={handleSegmentRemove}
              onAddSegment={handleAddSegment}
              onBuildPath={buildFromSegments}
            />
            
            <QueryParameterBuilder
              params={queryParams}
              onParamUpdate={(index, field, value) => {
                const newParams = [...queryParams];
                newParams[index][field] = value;
                setQueryParams(newParams);
              }}
              onParamRemove={(index) => {
                setQueryParams(queryParams.filter((_, i) => i !== index));
              }}
              onAddParam={() => {
                setQueryParams([...queryParams, { key: '', value: '' }]);
              }}
            />
          </TabsContent>
          
          <TabsContent value="complex" className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Base Path Pattern</label>
              <Input 
                value={basePath}
                onChange={(e) => setBasePath(e.target.value)}
                placeholder="/user/:id"
                className="font-mono"
              />
            </div>
            
            <ComplexParameterBuilder
              params={complexParams}
              onParamUpdate={(index, field, value) => {
                const newParams = [...complexParams];
                newParams[index][field] = value;
                setComplexParams(newParams);
              }}
              onParamRemove={(index) => {
                setComplexParams(complexParams.filter((_, i) => i !== index));
              }}
              onAddParam={() => {
                setComplexParams([...complexParams, { key: '', type: 'string', value: '' }]);
              }}
            />
          </TabsContent>
          
          <div className="flex gap-2 mt-6">
            <Button onClick={generateLink} className="flex-1">
              Generate Deep Link
            </Button>
            <Button onClick={parseLink} variant="outline">
              Parse Link
            </Button>
          </div>
          
          <GeneratedLinkDisplay link={generatedLink} />
        </Tabs>
      </CardContent>
    </Card>
  );
};
