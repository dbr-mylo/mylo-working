
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SystemHealthDashboard } from './SystemHealthDashboard';
import { RecoveryMetricsDashboard } from './RecoveryMetricsDashboard';

/**
 * Admin Dashboard component that provides access to different admin panels
 */
export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("system-health");
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="system-health">System Health</TabsTrigger>
          <TabsTrigger value="recovery-metrics">Recovery Metrics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="system-health" className="mt-0">
          <SystemHealthDashboard />
        </TabsContent>
        
        <TabsContent value="recovery-metrics" className="mt-0">
          <RecoveryMetricsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};
