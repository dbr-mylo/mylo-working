
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { navigationService } from "@/services/navigation/NavigationService";
import WriterDashboardHeader from "./WriterDashboardHeader";
import WriterQuickActions from "./WriterQuickActions";
import WriterContentTabs from "./WriterContentTabs";
import WriterSidebar from "./WriterSidebar";

interface MockDocument {
  id: string;
  title: string;
  updatedAt: string;
  status: "draft" | "published" | "archived";
  category: string;
}

/**
 * Specialized dashboard experience for writers with role-specific navigation options
 */
export const WriterDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { role, user } = useAuth();
  
  // Mock documents - in a real application, this would come from an API
  const recentDocuments: MockDocument[] = [
    { id: "doc1", title: "Weekly Blog Post", updatedAt: "2025-04-12T10:30:00Z", status: "draft", category: "Blog" },
    { id: "doc2", title: "Product Description", updatedAt: "2025-04-10T14:45:00Z", status: "published", category: "Marketing" },
    { id: "doc3", title: "Email Newsletter", updatedAt: "2025-04-08T09:15:00Z", status: "draft", category: "Email" },
  ];

  const mockAssignedDocuments: MockDocument[] = [
    { id: "doc4", title: "Annual Report", updatedAt: "2025-04-11T11:20:00Z", status: "draft", category: "Report" },
    { id: "doc5", title: "Feature Announcement", updatedAt: "2025-04-09T16:30:00Z", status: "draft", category: "Marketing" },
  ];

  const mockRecentTemplates = [
    { id: "template1", title: "Blog Post Template", updatedAt: "2025-04-05T09:00:00Z", status: "published", category: "Template" },
    { id: "template2", title: "Newsletter Template", updatedAt: "2025-04-01T14:00:00Z", status: "published", category: "Template" },
  ];
  
  // Track navigation event when component mounts
  useEffect(() => {
    navigationService.logNavigationEvent(
      document.referrer, 
      "/writer-dashboard", 
      true, 
      role,
      undefined
    );
  }, [role]);

  // Filter documents based on search query
  const filteredDocuments = recentDocuments.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      {/* Header with search */}
      <WriterDashboardHeader 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />
      
      {/* Quick Actions */}
      <WriterQuickActions />
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* Content Tabs */}
          <WriterContentTabs 
            filteredDocuments={filteredDocuments}
            mockAssignedDocuments={mockAssignedDocuments}
            mockRecentTemplates={mockRecentTemplates}
            searchQuery={searchQuery}
          />
        </div>
        
        {/* Sidebar */}
        <WriterSidebar role={role} />
      </div>
    </div>
  );
};

export default WriterDashboard;
