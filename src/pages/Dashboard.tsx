
import React, { useState } from "react";
import { RoleAwareLayout } from "@/components/layout/RoleAwareLayout";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { DashboardDocuments } from "@/components/dashboard/DashboardDocuments";
import { DashboardTemplates } from "@/components/dashboard/DashboardTemplates";
import { DashboardSettings } from "@/components/dashboard/DashboardSettings";
import { useDashboardData } from "@/hooks/dashboard/useDashboardData";

const Dashboard = () => {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const { 
    recentDocuments, 
    recentTemplates, 
    isLoading, 
    stats 
  } = useDashboardData();
  
  return (
    <RoleAwareLayout role={role} showRoleNavigation={false}>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        {/* Dashboard Sidebar */}
        <DashboardSidebar />
        
        {/* Main Content Area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top Navigation */}
          <DashboardNav />
          
          {/* Main Content */}
          <div className="flex-1 overflow-auto p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <DashboardOverview 
                  recentDocuments={recentDocuments} 
                  recentTemplates={recentTemplates}
                  isLoading={isLoading}
                  stats={stats}
                />
              </TabsContent>
              
              <TabsContent value="documents">
                <DashboardDocuments />
              </TabsContent>
              
              <TabsContent value="templates">
                <DashboardTemplates />
              </TabsContent>
              
              <TabsContent value="settings">
                <DashboardSettings />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </RoleAwareLayout>
  );
};

export default Dashboard;
