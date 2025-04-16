
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { generateDeepLink } from './utils/parameterTestUtils';
import { PathSegmentBuilder, PathSegment } from './components/PathSegmentBuilder';
import { QueryParameterBuilder } from './components/QueryParameterBuilder';
import { GeneratedLinkDisplay } from './components/GeneratedLinkDisplay';

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

  const generateLink = () => {
    try {
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
        <div className="space-y-6">
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
          
          <Button onClick={generateLink} className="w-full">
            Generate Deep Link
          </Button>
          
          <GeneratedLinkDisplay link={generatedLink} />
        </div>
      </CardContent>
    </Card>
  );
};
