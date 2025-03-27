
import React, { useState } from 'react';
import { ToolbarTester } from './ToolbarTester';
import { ManualTestChecklist } from './ManualTestChecklist';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const MainRegressionTester = () => {
  const [activeTab, setActiveTab] = useState('automated');
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Toolbar Regression Testing Suite</h1>
      
      <Tabs 
        defaultValue="automated" 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="automated">Automated Tests</TabsTrigger>
          <TabsTrigger value="manual">Manual Checklist</TabsTrigger>
        </TabsList>
        
        <TabsContent value="automated" className="mt-6">
          <ToolbarTester />
        </TabsContent>
        
        <TabsContent value="manual" className="mt-6">
          <ManualTestChecklist />
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 p-4 border rounded-lg bg-muted/50">
        <h2 className="text-lg font-semibold mb-2">Testing Instructions</h2>
        <p className="text-sm text-muted-foreground mb-4">
          This regression testing suite helps verify that all toolbar functionality is working correctly 
          after the recent refactoring. Use both the automated tests and manual checklist to ensure
          complete coverage.
        </p>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-md font-medium mb-1">Automated Testing Tab</h3>
            <ul className="text-sm list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Run component tests for Base, Writer, or Designer components</li>
              <li>View test results and logs</li>
              <li>Generate automated test reports</li>
              <li>Preview components for visual inspection</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-md font-medium mb-1">Manual Checklist Tab</h3>
            <ul className="text-sm list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Complete granular test cases for each component</li>
              <li>Add notes for each test case</li>
              <li>Filter tests by category</li>
              <li>Generate detailed manual test reports</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
