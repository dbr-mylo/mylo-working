
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ParameterExtractionTester } from './ParameterExtractionTester';
import ParameterValidationTester from './ParameterValidationTester';
import { OptionalParameterTester } from './OptionalParameterTester';

export const ParameterTestingSuite: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Parameter Testing Suite</CardTitle>
          <CardDescription>
            Comprehensive testing tools for URL parameter handling
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Tabs defaultValue="extraction" className="space-y-4">
        <TabsList>
          <TabsTrigger value="extraction">Parameter Extraction</TabsTrigger>
          <TabsTrigger value="validation">Parameter Validation</TabsTrigger>
          <TabsTrigger value="optional">Optional Parameters</TabsTrigger>
        </TabsList>
        
        <TabsContent value="extraction">
          <ParameterExtractionTester />
        </TabsContent>
        
        <TabsContent value="validation">
          <ParameterValidationTester />
        </TabsContent>
        
        <TabsContent value="optional">
          <OptionalParameterTester />
        </TabsContent>
      </Tabs>
    </div>
  );
};
