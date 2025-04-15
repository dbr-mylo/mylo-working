
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ParameterExtractionTester } from './ParameterExtractionTester';
import { NavigationParameterTester } from './NavigationParameterTester';
import { DeepLinkTester } from './DeepLinkTester';

export const ParameterTestingSuite: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dynamic Route Parameter Testing Suite</h1>
      <p className="text-muted-foreground">
        Test and validate route parameter extraction, navigation service parameters, and deep link generation
      </p>
      
      <Tabs defaultValue="extraction" className="w-full">
        <TabsList>
          <TabsTrigger value="extraction">Parameter Extraction</TabsTrigger>
          <TabsTrigger value="navigation">Navigation Parameters</TabsTrigger>
          <TabsTrigger value="deeplink">Deep Link Generation</TabsTrigger>
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
      </Tabs>
    </div>
  );
};
