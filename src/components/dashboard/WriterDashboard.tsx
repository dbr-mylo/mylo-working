
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigationHandlers } from "@/hooks/navigation/useNavigationHandlers";
import { DocumentCard } from "./DocumentCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Edit, Clock, BookOpen, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { navigationService } from "@/services/navigation/NavigationService";

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
  const { navigateTo } = useNavigationHandlers();
  const { role } = useAuth();
  
  // Mock documents - in a real application, this would come from an API
  const recentDocuments: MockDocument[] = [
    { id: "doc1", title: "Weekly Blog Post", updatedAt: "2025-04-12T10:30:00Z", status: "draft", category: "Blog" },
    { id: "doc2", title: "Product Description", updatedAt: "2025-04-10T14:45:00Z", status: "published", category: "Marketing" },
    { id: "doc3", title: "Email Newsletter", updatedAt: "2025-04-08T09:15:00Z", status: "draft", category: "Email" },
  ];
  
  // Track navigation event when component mounts
  React.useEffect(() => {
    navigationService.logNavigationEvent(
      document.referrer, 
      "/writer-dashboard", 
      true, 
      role,
      undefined
    );
  }, [role]);
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Writer Dashboard</h1>
      
      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="font-semibold mb-2">New Document</h3>
              <p className="text-sm text-gray-600 mb-4">Create a fresh document</p>
              <Button
                onClick={() => navigateTo("/editor")}
                className="w-full"
              >
                Create
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Edit className="h-6 w-6 text-purple-700" />
              </div>
              <h3 className="font-semibold mb-2">My Drafts</h3>
              <p className="text-sm text-gray-600 mb-4">Continue working on drafts</p>
              <Button
                variant="outline"
                onClick={() => navigateTo("/content/drafts")}
                className="w-full"
              >
                View Drafts
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-green-700" />
              </div>
              <h3 className="font-semibold mb-2">Templates</h3>
              <p className="text-sm text-gray-600 mb-4">Use pre-made templates</p>
              <Button
                variant="outline"
                onClick={() => navigateTo("/templates")}
                className="w-full"
              >
                Browse Templates
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-amber-700" />
              </div>
              <h3 className="font-semibold mb-2">Recent Activity</h3>
              <p className="text-sm text-gray-600 mb-4">View your recent work</p>
              <Button
                variant="outline"
                onClick={() => navigateTo("/activity")}
                className="w-full"
              >
                View Activity
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Content Tabs */}
      <div>
        <Tabs defaultValue="recent">
          <TabsList className="mb-6">
            <TabsTrigger value="recent">Recent Documents</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="shared">Shared With Me</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentDocuments.map(doc => (
                <DocumentCard
                  key={doc.id}
                  document={{
                    id: doc.id,
                    title: doc.title,
                    updated_at: doc.updatedAt,
                    content: "", // Adding required property for Document type
                    status: doc.status,
                    meta: { // Use meta for additional properties
                      tags: [doc.category],
                      category: doc.category,
                    }
                  }}
                  onClick={() => navigateTo(`/editor/${doc.id}`)}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="favorites">
            <div className="flex flex-col items-center justify-center py-8">
              <Star className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
              <p className="text-gray-500 mb-4">Mark documents as favorites to see them here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="shared">
            <div className="flex flex-col items-center justify-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No shared documents</h3>
              <p className="text-gray-500 mb-4">Documents shared with you will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WriterDashboard;
