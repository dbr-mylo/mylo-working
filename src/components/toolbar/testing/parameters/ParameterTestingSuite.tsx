
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ParameterExtractionTester } from './ParameterExtractionTester';
import ParameterValidationTester from './ParameterValidationTester';
import { OptionalParameterTester } from './OptionalParameterTester';
import { NestedParameterTester } from './components/NestedParameterTester';
import ParameterTestingGuide from './docs/ParameterTestingGuide';
import NestedParameterTestSuite from './tests/NestedParameterTestSuite';

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
        <CardContent>
          <p className="text-muted-foreground">
            This suite provides tools for testing parameter extraction, validation, nesting, and optional parameters.
            Use the tabs below to access different testing tools.
          </p>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="nested" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-6">
          <TabsTrigger value="nested">Nested Parameters</TabsTrigger>
          <TabsTrigger value="extraction">Parameter Extraction</TabsTrigger>
          <TabsTrigger value="validation">Parameter Validation</TabsTrigger>
          <TabsTrigger value="optional">Optional Parameters</TabsTrigger>
          <TabsTrigger value="test-suite">Test Suite</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="nested">
          <NestedParameterTester />
        </TabsContent>
        
        <TabsContent value="extraction">
          <ParameterExtractionTester />
        </TabsContent>
        
        <TabsContent value="validation">
          <ParameterValidationTester />
        </TabsContent>
        
        <TabsContent value="optional">
          <OptionalParameterTester />
        </TabsContent>
        
        <TabsContent value="test-suite">
          <NestedParameterTestSuite />
        </TabsContent>

        <TabsContent value="docs">
          <ParameterTestingGuide />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParameterTestingSuite;
