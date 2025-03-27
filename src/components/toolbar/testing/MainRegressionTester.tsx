
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToolbarTester } from './ToolbarTester';
import { ManualTestChecklist } from './ManualTestChecklist';
import { RoleSystemAnalysis } from './RoleSystemAnalysis';
import { RoleSystemMigrationStatus } from './components/RoleSystemMigrationStatus';
import { Badge } from '@/components/ui/badge';

export const MainRegressionTester = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Role System Testing</h1>
        <p className="text-muted-foreground mb-4">
          Test and analyze the role-based component implementation for consistency and correctness
        </p>
        <div className="flex items-center gap-2 mb-6">
          <Badge className="bg-green-500 hover:bg-green-600">Phase 4 Complete</Badge>
          <Badge variant="outline" className="text-green-500 border-green-500">Documentation Enhanced</Badge>
        </div>
        
        {/* Standalone Migration Status Overview */}
        <RoleSystemMigrationStatus />
      </div>
      
      <Tabs defaultValue="toolbar-tester">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="toolbar-tester">Toolbar Tests</TabsTrigger>
          <TabsTrigger value="manual-checklist">Manual Verification</TabsTrigger>
          <TabsTrigger value="system-analysis">System Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="toolbar-tester">
          <ToolbarTester />
        </TabsContent>
        
        <TabsContent value="manual-checklist">
          <ManualTestChecklist />
        </TabsContent>
        
        <TabsContent value="system-analysis">
          <RoleSystemAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
};
