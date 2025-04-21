
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Play } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { NavigationParameterTesterProps } from './types';

export const NavigationParameterTester: React.FC<NavigationParameterTesterProps> = ({ 
  onTestResult 
}) => {
  const [routePattern, setRoutePattern] = useState('/users/:userId/profiles/:profileId?');
  const [path, setPath] = useState('/users/123/profiles/456');
  const [error, setError] = useState<string | null>(null);
  
  const handleTest = async () => {
    setError(null);
    
    try {
      // Simulate test execution
      const startTime = performance.now();
      
      // Mock result - In a real implementation, this would call the actual parameter extraction logic
      const mockResult = {
        params: {
          userId: '123',
          profileId: '456'
        },
        hierarchy: {
          userId: {
            name: 'userId',
            isOptional: false,
            children: ['profileId'],
            level: 0
          },
          profileId: {
            name: 'profileId',
            isOptional: true,
            parent: 'userId',
            children: [],
            level: 1
          }
        },
        isValid: true,
        errors: [],
        performance: {
          extractionTime: performance.now() - startTime
        },
        timestamp: new Date().toISOString(),
        memoizedExtractionTime: (performance.now() - startTime) / 2
      };
      
      onTestResult(mockResult);
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    }
  };
  
  const handleInvalidTest = async () => {
    setError(null);
    
    try {
      // Simulate test execution with errors
      const startTime = performance.now();
      
      // Mock result with validation errors
      const mockResult = {
        params: {
          userId: 'abc', // Invalid - should be numeric
          profileId: '' // Invalid - required parameter is empty
        },
        hierarchy: {
          userId: {
            name: 'userId',
            isOptional: false,
            children: ['profileId'],
            level: 0
          },
          profileId: {
            name: 'profileId',
            isOptional: false, // This is required per our mock
            parent: 'userId',
            children: [],
            level: 1
          }
        },
        isValid: false,
        errors: [
          'Parameter userId must be numeric',
          'Parameter profileId is required'
        ],
        performance: {
          extractionTime: performance.now() - startTime
        },
        timestamp: new Date().toISOString(),
        memoizedExtractionTime: (performance.now() - startTime) / 2
      };
      
      onTestResult(mockResult);
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    }
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <Tabs defaultValue="manual">
          <TabsList className="mb-4">
            <TabsTrigger value="manual">Manual Test</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="routePattern">Route Pattern</Label>
                <Input
                  id="routePattern"
                  value={routePattern}
                  onChange={(e) => setRoutePattern(e.target.value)}
                  placeholder="/users/:userId/profiles/:profileId?"
                />
                <p className="text-xs text-muted-foreground">
                  Define route pattern with parameters (:param) and optional parameters (:param?)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="path">Test Path</Label>
                <Input
                  id="path"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  placeholder="/users/123/profiles/456"
                />
                <p className="text-xs text-muted-foreground">
                  Enter a path to extract parameters from
                </p>
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="flex gap-2">
                <Button onClick={handleTest} className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  Run Test
                </Button>
                <Button onClick={handleInvalidTest} variant="outline" className="flex-1">
                  Test With Errors
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="examples">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Click an example to run a preconfigured test:
              </p>
              
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  className="justify-start h-auto py-2"
                  onClick={() => {
                    setRoutePattern('/articles/:category/:articleId');
                    setPath('/articles/technology/123');
                  }}
                >
                  <div className="text-left">
                    <p className="font-medium">Basic Parameters</p>
                    <p className="text-xs text-muted-foreground">
                      /articles/:category/:articleId
                    </p>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="justify-start h-auto py-2"
                  onClick={() => {
                    setRoutePattern('/projects/:projectId/tasks/:taskId?');
                    setPath('/projects/abc123/tasks/');
                  }}
                >
                  <div className="text-left">
                    <p className="font-medium">Optional Parameters</p>
                    <p className="text-xs text-muted-foreground">
                      /projects/:projectId/tasks/:taskId?
                    </p>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="justify-start h-auto py-2"
                  onClick={() => {
                    setRoutePattern('/users/:userId/profiles/:profileId/settings/:settingId');
                    setPath('/users/123/profiles/456/settings/theme');
                  }}
                >
                  <div className="text-left">
                    <p className="font-medium">Nested Parameters</p>
                    <p className="text-xs text-muted-foreground">
                      /users/:userId/profiles/:profileId/settings/:settingId
                    </p>
                  </div>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
