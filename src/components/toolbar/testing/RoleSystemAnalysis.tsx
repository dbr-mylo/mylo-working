
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RoleHooksTable } from './components/RoleHooksTable';
import { RoleComponentsTable } from './components/RoleComponentsTable';
import { ToolbarComponentsTable } from './components/ToolbarComponentsTable';
import { CoreIssuesList } from './components/CoreIssuesList';
import { MigrationStrategy } from './components/MigrationStrategy';
import { KeyRoleFiles } from './components/KeyRoleFiles';
import { RoleSystemMigrationStatus } from './components/RoleSystemMigrationStatus';

export const RoleSystemAnalysis: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Role System Analysis</CardTitle>
        <CardDescription>
          Comprehensive analysis of the role-based access control system implementation
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* New Migration Status Overview */}
        <RoleSystemMigrationStatus />
        
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="implementations">Role Implementations</TabsTrigger>
            <TabsTrigger value="components">Component Analysis</TabsTrigger>
            <TabsTrigger value="strategy">Migration Strategy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <CoreIssuesList />
            <KeyRoleFiles />
          </TabsContent>
          
          <TabsContent value="implementations" className="space-y-4">
            <RoleHooksTable />
            <RoleComponentsTable />
          </TabsContent>
          
          <TabsContent value="components" className="space-y-4">
            <ToolbarComponentsTable />
          </TabsContent>
          
          <TabsContent value="strategy" className="space-y-4">
            <MigrationStrategy />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
