
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MissingParameterTester from './MissingParameterTester';
import { ParameterPerformanceTester } from './ParameterPerformanceTester';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

export const ParameterTestingSuite = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Parameter Testing Suite</CardTitle>
          <CardDescription>
            Basic testing tools for parameter extraction and validation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            This suite provides basic tools for testing parameter handling in routes.
            For more advanced testing options, including memory analysis and integration tests,
            use the Advanced Parameter Testing Suite.
          </p>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => navigate('/testing/parameters/advanced')}
          >
            Open Advanced Testing Suite <ExternalLink className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="missing" className="space-y-4">
        <TabsList>
          <TabsTrigger value="missing">Missing Parameters</TabsTrigger>
          <TabsTrigger value="performance">Performance Tests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="missing">
          <MissingParameterTester />
        </TabsContent>
        
        <TabsContent value="performance">
          <ParameterPerformanceTester />
        </TabsContent>
      </Tabs>
    </div>
  );
};
