
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TestsPanel } from './TestsPanel';
import { PerformanceMetricsVisualization } from '../components/PerformanceMetricsVisualization';

const NestedParameterTestSuite: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nested Parameter Test Suite</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tests">
            <TabsList className="mb-4">
              <TabsTrigger value="tests">Test Cases</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tests">
              <TestsPanel />
            </TabsContent>
            
            <TabsContent value="metrics">
              <PerformanceMetricsVisualization />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default NestedParameterTestSuite;
