
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import MalformedURLTester from './MalformedURLTester';
import MissingParameterTester from './MissingParameterTester';
import ParameterValidationTester from './ParameterValidationTester';

export const ParameterTestingSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState('malformed');
  
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Route Parameter Testing Suite</h1>
          <p className="text-muted-foreground">
            Comprehensive testing tools for route parameter handling, validation, and edge cases
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Test Categories</CardTitle>
            <CardDescription>
              Select a test category to explore different parameter handling aspects
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="malformed">Malformed URLs</TabsTrigger>
            <TabsTrigger value="missing">Missing Parameters</TabsTrigger>
            <TabsTrigger value="validation">Parameter Validation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="malformed">
            <MalformedURLTester />
          </TabsContent>
          
          <TabsContent value="missing">
            <MissingParameterTester />
          </TabsContent>
          
          <TabsContent value="validation">
            <ParameterValidationTester />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
