
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
import { RoleNavigationWrapper } from "@/components/navigation/RoleNavigationWrapper";
import { ProjectsProvider } from "@/contexts/ProjectsContext";
import { WithErrorBoundary } from "@/components/errors/WithErrorBoundary";

const Dashboard = () => {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { 
    recentDocuments, 
    recentTemplates, 
    isLoading, 
    stats 
  } = useDashboardData();
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // If not on the documents tab, switch to it
    if (activeTab !== "documents") {
      setActiveTab("documents");
    }
  };
  
  return (
    <ProjectsProvider>
      <div className="h-screen overflow-hidden bg-gray-50 flex flex-col">
        {/* Top Navigation */}
        <DashboardNav onSearch={handleSearch} />
        
        {/* Role-based Navigation */}
        <div className="border-b border-gray-200 bg-white">
          <div className="container mx-auto px-4">
            <RoleNavigationWrapper />
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Dashboard Sidebar */}
          <DashboardSidebar />
          
          {/* Content Area */}
          <div className="flex-1 overflow-auto p-6">
            <WithErrorBoundary context="DashboardTabs">
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
                  <DashboardDocuments searchQuery={searchQuery} />
                </TabsContent>
                
                <TabsContent value="templates">
                  <DashboardTemplates />
                </TabsContent>
                
                <TabsContent value="settings">
                  <DashboardSettings />
                </TabsContent>
              </Tabs>
            </WithErrorBoundary>
          </div>
        </div>
      </div>
    </ProjectsProvider>
  );
};

export default Dashboard;
