
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Document } from "@/lib/types";

interface DashboardStats {
  totalDocuments: number;
  totalTemplates: number;
  recentEdits: number;
  completedDocuments: number;
}

export const useDashboardData = () => {
  const { user, role } = useAuth();
  const [recentDocuments, setRecentDocuments] = useState<Document[]>([]);
  const [recentTemplates, setRecentTemplates] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalDocuments: 0,
    totalTemplates: 0,
    recentEdits: 0,
    completedDocuments: 0
  });
  
  // Load dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        // Mock data for now - would be replaced with actual API calls
        // This simulates fetching recent documents
        setTimeout(() => {
          setRecentDocuments([
            {
              id: "doc-1",
              title: "Annual Report",
              content: "Content here...",
              updated_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              owner_id: user.id,
              status: "draft",
              meta: { template_id: "temp-1" }
            },
            {
              id: "doc-2",
              title: "Project Proposal",
              content: "Content here...",
              updated_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
              created_at: new Date(Date.now() - 86400000).toISOString(), 
              owner_id: user.id,
              status: "completed",
              meta: { template_id: "temp-2" }
            }
          ]);
          
          // Only load templates data if user is designer or admin
          if (role === "designer" || role === "admin") {
            setRecentTemplates([
              {
                id: "temp-1",
                title: "Report Template",
                content: "Template content...",
                updated_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
                owner_id: user.id,
                status: "published",
                meta: {}
              },
              {
                id: "temp-2",
                title: "Proposal Template",
                content: "Template content...",
                updated_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                created_at: new Date(Date.now() - 86400000).toISOString(),
                owner_id: user.id,
                status: "draft",
                meta: {}
              }
            ]);
          }
          
          // Set stats
          setStats({
            totalDocuments: 12,
            totalTemplates: role === "designer" || role === "admin" ? 7 : 0,
            recentEdits: 3,
            completedDocuments: 9
          });
          
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user, role]);
  
  return {
    recentDocuments,
    recentTemplates,
    isLoading,
    stats
  };
};
