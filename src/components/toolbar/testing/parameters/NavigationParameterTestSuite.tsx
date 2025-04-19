
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ParameterPerformanceTester } from './ParameterPerformanceTester';
import { ParameterRouteNavigationTester } from './ParameterRouteNavigationTester';
import { ParameterPreservationTester } from './ParameterPreservationTester';
import MissingParameterTester from './MissingParameterTester';
import { NestedParameterTestSuite } from './tests/NestedParameterTestSuite';

export const NavigationParameterTestSuite: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Navigation Parameter Testing Suite</CardTitle>
          <CardDescription>
            Comprehensive testing of parameter handling, extraction, performance, and integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This suite provides tools for testing various aspects of route parameter handling
            including performance, memory usage, edge cases, and integration with the navigation system.
          </p>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="nested" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="nested">Nested Tests</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="missing">Missing Parameters</TabsTrigger>
          <TabsTrigger value="navigation">Route Navigation</TabsTrigger>
          <TabsTrigger value="preservation">Parameter Preservation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="nested" className="mt-6">
          <NestedParameterTestSuite />
        </TabsContent>
        
        <TabsContent value="performance" className="mt-6">
          <ParameterPerformanceTester />
        </TabsContent>
        
        <TabsContent value="missing" className="mt-6">
          <MissingParameterTester />
        </TabsContent>
        
        <TabsContent value="navigation" className="mt-6">
          <ParameterRouteNavigationTester />
        </TabsContent>
        
        <TabsContent value="preservation" className="mt-6">
          <ParameterPreservationTester />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NavigationParameterTestSuite;
