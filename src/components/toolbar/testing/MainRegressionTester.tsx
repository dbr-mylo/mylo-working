
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ManualTestChecklist } from './ManualTestChecklist';
import { ToolbarTester } from './ToolbarTester';
import { DocumentEditingTester } from './DocumentEditingTester';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WithErrorBoundary } from '@/components/errors/WithErrorBoundary';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, FileText, Settings, CheckSquare } from 'lucide-react';

export const MainRegressionTester = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Regression Testing Suite</h1>
        <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
          v1.2.0
        </div>
      </div>
      
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Enhanced Testing Capabilities</AlertTitle>
        <AlertDescription>
          This testing suite now includes improved analytics, performance metrics, and test coverage visualization.
          All tests use retry capabilities for improved reliability.
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="editor">
        <TabsList className="mb-4">
          <TabsTrigger value="editor" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Document Editing Tests
          </TabsTrigger>
          <TabsTrigger value="toolbar" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Toolbar Component Tests
          </TabsTrigger>
          <TabsTrigger value="checklist" className="flex items-center">
            <CheckSquare className="h-4 w-4 mr-2" />
            Manual Test Checklist
          </TabsTrigger>
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
