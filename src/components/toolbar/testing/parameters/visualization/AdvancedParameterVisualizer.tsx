
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ParameterHierarchyGraph } from '../components/visualization/ParameterHierarchyGraph';
import { ValidationErrorVisualizer } from '../components/visualization/ValidationErrorVisualizer';
import { ParameterPerformanceAnalytics } from '../components/analytics/ParameterPerformanceAnalytics';
import { Button } from '@/components/ui/button';
import { ArrowPathIcon } from 'lucide-react';
import { clearParameterCaches } from '@/utils/navigation/parameters/memoizedParameterHandler';

interface AdvancedParameterVisualizerProps {
  testResults: any;
  performanceHistory?: any[];
  onClearCaches?: () => void;
}

export const AdvancedParameterVisualizer: React.FC<AdvancedParameterVisualizerProps> = ({
  testResults,
  performanceHistory = [],
  onClearCaches
}) => {
  const [activeTab, setActiveTab] = useState('hierarchy');

  const handleClearCaches = () => {
    clearParameterCaches();
    if (onClearCaches) {
      onClearCaches();
    }
  };

  if (!testResults) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Parameter Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Run a parameter test to see visualizations</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const {
    params = {},
    hierarchy = {},
    errors = [],
    warnings = [],
    performance = {},
    isValid
  } = testResults;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Parameter Visualization</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleClearCaches}
        >
          <ArrowPathIcon className="h-4 w-4 mr-2" /> Clear Caches
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="hierarchy">Hierarchy</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hierarchy">
            <ParameterHierarchyGraph 
              hierarchy={hierarchy}
              params={params}
            />
          </TabsContent>
          
          <TabsContent value="validation">
            <ValidationErrorVisualizer 
              errors={errors}
              warnings={warnings}
              params={params}
            />
          </TabsContent>
          
          <TabsContent value="performance">
            <ParameterPerformanceAnalytics 
              performanceHistory={performanceHistory}
              currentExtractionTime={performance.extractionTime}
              currentValidationTime={performance.validationTime}
              memoizedExtractionTime={performance.memoizedExtractionTime}
              memoizedValidationTime={performance.memoizedValidationTime}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
