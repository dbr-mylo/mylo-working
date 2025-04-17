
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NavigationErrorTester from './NavigationErrorTester';
import RoleTransitionTester from './RoleTransitionTester';

/**
 * Dashboard component for navigation testing
 */
export const NavigationTestDashboard: React.FC = () => {
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Navigation Testing Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive testing tools for navigation error handling and role transitions
          </p>
        </div>
        
        <Tabs defaultValue="errors" className="w-full">
          <TabsList>
            <TabsTrigger value="errors">Error Scenarios</TabsTrigger>
            <TabsTrigger value="roles">Role Transitions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="errors" className="mt-4">
            <NavigationErrorTester />
          </TabsContent>
          
          <TabsContent value="roles" className="mt-4">
            <RoleTransitionTester />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NavigationTestDashboard;
