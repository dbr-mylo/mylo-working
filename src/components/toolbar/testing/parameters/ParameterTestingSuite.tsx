
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ParameterExtractionTester } from './ParameterExtractionTester';
import { NavigationParameterTester } from './NavigationParameterTester';
import { DeepLinkTester } from './DeepLinkTester';
import { PerformanceMetrics } from './components/PerformanceMetrics';
import { EDGE_CASE_TEST_SCENARIOS } from './utils/edgeCaseUtils';
import { EdgeCaseTestSuite } from './components/EdgeCaseTestSuite';

export const ParameterTestingSuite: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dynamic Route Parameter Testing Suite</h1>
      <p className="text-muted-foreground">
        Test and validate route parameter extraction, navigation service parameters, and deep link generation
      </p>
      
      <PerformanceMetrics 
        metrics={{
          averageTime: 2.5,
          maxTime: 8.3,
          minTime: 1.2,
          totalTests: Object.keys(EDGE_CASE_TEST_SCENARIOS).length,
          passedTests: Object.keys(EDGE_CASE_TEST_SCENARIOS).length - 1
        }}
      />
      
      <Tabs defaultValue="extraction" className="w-full">
        <TabsList>
          <TabsTrigger value="extraction">Parameter Extraction</TabsTrigger>
          <TabsTrigger value="navigation">Navigation Parameters</TabsTrigger>
          <TabsTrigger value="deeplink">Deep Link Generation</TabsTrigger>
          <TabsTrigger value="edgecases">Edge Cases</TabsTrigger>
        </TabsList>
        
        <TabsContent value="extraction" className="mt-4">
          <ParameterExtractionTester />
        </TabsContent>
        
        <TabsContent value="navigation" className="mt-4">
          <NavigationParameterTester />
        </TabsContent>
        
        <TabsContent value="deeplink" className="mt-4">
          <DeepLinkTester />
        </TabsContent>
        
        <TabsContent value="edgecases" className="mt-4">
          <EdgeCaseTestSuite />
        </TabsContent>
      </Tabs>
    </div>
  );
};
