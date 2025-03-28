
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ManualTestChecklist } from './ManualTestChecklist';
import { ToolbarTester } from './ToolbarTester';
import { DocumentEditingTester } from './DocumentEditingTester';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WithErrorBoundary } from '@/components/errors/WithErrorBoundary';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

export const MainRegressionTester = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold mb-2">Regression Testing Suite</h1>
      
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Testing Capabilities</AlertTitle>
        <AlertDescription>
          This testing suite includes automated tests for document editing, UI components, and
          manual checklist verification. Tests use retry capabilities for improved reliability.
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="editor">
        <TabsList className="mb-4">
          <TabsTrigger value="editor">Document Editing Tests</TabsTrigger>
          <TabsTrigger value="toolbar">Toolbar Component Tests</TabsTrigger>
          <TabsTrigger value="checklist">Manual Test Checklist</TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor">
          <WithErrorBoundary context="DocumentEditingTester" allowReset>
            <DocumentEditingTester />
          </WithErrorBoundary>
        </TabsContent>
        
        <TabsContent value="toolbar">
          <WithErrorBoundary context="ToolbarTester" allowReset>
            <ToolbarTester />
          </WithErrorBoundary>
        </TabsContent>
        
        <TabsContent value="checklist">
          <Card>
            <CardHeader>
              <CardTitle>Manual Testing Checklist</CardTitle>
              <CardDescription>
                Use this checklist to verify functionality that requires human verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WithErrorBoundary context="ManualTestChecklist" allowReset>
                <ManualTestChecklist />
              </WithErrorBoundary>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
