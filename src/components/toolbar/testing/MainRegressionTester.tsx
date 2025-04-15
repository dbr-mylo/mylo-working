
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NavigationRegressionTester } from './NavigationRegressionTester';
import { RoutingTestSuite } from './RoutingTestSuite';
import { ParameterTestingSuite } from './parameters/ParameterTestingSuite';

export const MainRegressionTester: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Regression Test Suite</h1>
      
      <Tabs defaultValue="navigation" className="w-full">
        <TabsList>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="routing">Advanced Routing</TabsTrigger>
          <TabsTrigger value="parameters">Route Parameters</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="navigation" className="mt-4">
          <NavigationRegressionTester />
        </TabsContent>
        
        <TabsContent value="routing" className="mt-4">
          <RoutingTestSuite />
        </TabsContent>
        
        <TabsContent value="parameters" className="mt-4">
          <ParameterTestingSuite />
        </TabsContent>
        
        <TabsContent value="permissions" className="mt-4">
          <div className="p-4 border rounded-md bg-muted">
            <p>Permission regression tests will be added in a future update.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="mt-4">
          <div className="p-4 border rounded-md bg-muted">
            <p>Template regression tests will be added in a future update.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
