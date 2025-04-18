
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MissingParameterTester } from './MissingParameterTester';
import { ParameterPerformanceTester } from './ParameterPerformanceTester';

export const ParameterTestingSuite = () => {
  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Parameter Testing Suite</h1>
      
      <Tabs defaultValue="missing">
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
