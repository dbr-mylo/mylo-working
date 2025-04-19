
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OverviewTab } from './tabs/OverviewTab';
import { ValidationTab } from './tabs/ValidationTab';
import { NestedTab } from './tabs/NestedTab';
import { PerformanceTab } from './tabs/PerformanceTab';

export const ParameterTestingGuide: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Parameter Testing Guide</CardTitle>
        <CardDescription>
          Comprehensive documentation for the parameter testing and validation system
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="validation">Validation Rules</TabsTrigger>
            <TabsTrigger value="nested">Nested Parameters</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>
          
          <TabsContent value="validation">
            <ValidationTab />
          </TabsContent>
          
          <TabsContent value="nested">
            <NestedTab />
          </TabsContent>
          
          <TabsContent value="performance">
            <PerformanceTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ParameterTestingGuide;
