
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ManualTestChecklist } from './ManualTestChecklist';
import { ToolbarTester } from './ToolbarTester';
import { DocumentEditingTester } from './DocumentEditingTester';

export const MainRegressionTester = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Regression Testing Suite</h1>
      
      <Tabs defaultValue="checklist">
        <TabsList className="mb-4">
          <TabsTrigger value="checklist">Manual Test Checklist</TabsTrigger>
          <TabsTrigger value="toolbar">Toolbar Component Tests</TabsTrigger>
          <TabsTrigger value="editor">Document Editing Tests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="checklist">
          <ManualTestChecklist />
        </TabsContent>
        
        <TabsContent value="toolbar">
          <ToolbarTester />
        </TabsContent>
        
        <TabsContent value="editor">
          <DocumentEditingTester />
        </TabsContent>
      </Tabs>
    </div>
  );
};
