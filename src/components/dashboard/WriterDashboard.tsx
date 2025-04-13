
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigationHandlers } from "@/hooks/navigation/useNavigationHandlers";
import { DocumentCard } from "./DocumentCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Edit, Clock, BookOpen, Star, Calendar, PenTool, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { navigationService } from "@/services/navigation/NavigationService";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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
  const { role, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
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
  React.useEffect(() => {
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
  
  // Get role-specific navigation suggestions
  const suggestedRoutes = React.useMemo(() => 
    navigationService.getRoleSuggestedRoutes(role, 5), 
    [role]
  );

  // Navigation analytics (writer-specific)
  const writerMetrics = navigationService.getWriterNavigationMetrics();
  
  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Writer Dashboard</h1>
          <p className="text-muted-foreground">Welcome back{user?.name ? `, ${user.name}` : ''}!</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigateTo('/help')}
            size="sm"
          >
            Help Center
          </Button>
          <Button 
            onClick={() => navigateTo('/editor')}
          >
            New Document
          </Button>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search documents..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
                <Calendar className="h-6 w-6 text-amber-700" />
              </div>
              <h3 className="font-semibold mb-2">Schedule</h3>
              <p className="text-sm text-gray-600 mb-4">View content calendar</p>
              <Button
                variant="outline"
                onClick={() => navigateTo("/content/calendar")}
                className="w-full"
              >
                View Calendar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* Content Tabs */}
          <Tabs defaultValue="recent">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="assigned">Assigned</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateTo("/documents")}
              >
                View All Documents
              </Button>
            </div>
            
            <TabsContent value="recent" className="space-y-6">
              {filteredDocuments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg">No documents found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? `No results matching "${searchQuery}"` : "You don't have any recent documents"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDocuments.map(doc => (
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
                      viewMode="grid"
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="assigned">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockAssignedDocuments.map(doc => (
                  <DocumentCard
                    key={doc.id}
                    document={{
                      id: doc.id,
                      title: doc.title,
                      updated_at: doc.updatedAt,
                      content: "",
                      status: doc.status,
                      meta: {
                        tags: [doc.category],
                        category: doc.category,
                      }
                    }}
                    onClick={() => navigateTo(`/editor/${doc.id}`)}
                    viewMode="grid"
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="templates">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockRecentTemplates.map(template => (
                  <DocumentCard
                    key={template.id}
                    document={{
                      id: template.id,
                      title: template.title,
                      updated_at: template.updatedAt,
                      content: "",
                      status: template.status,
                      meta: {
                        tags: [template.category],
                        category: template.category,
                      }
                    }}
                    isTemplate={true}
                    onClick={() => navigateTo(`/templates/${template.id}`)}
                    viewMode="grid"
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Writer Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Writer Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 rounded-full p-2 mr-3">
                  <PenTool className="h-4 w-4 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm font-medium">Weekly Progress</p>
                  <p className="text-2xl font-bold">3 / 5</p>
                </div>
              </div>
              
              <div className="h-2 bg-blue-100 rounded mb-3">
                <div className="h-full bg-blue-600 rounded" style={{ width: '60%' }} />
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                You've completed 3 of your 5 weekly writing goals
              </p>
              
              <Separator className="my-3" />
              
              <div className="space-y-2 mt-3">
                <div className="flex justify-between items-center text-sm">
                  <span>Documents Created</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Average Time per Doc</span>
                  <span className="font-medium">32min</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Completion Rate</span>
                  <span className="font-medium">84%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Suggested Routes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Navigation</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[220px]">
                <div className="p-4">
                  {suggestedRoutes.map((route, index) => (
                    <Button 
                      key={`${route.path}-${index}`}
                      variant="ghost"
                      className="w-full justify-start text-left mb-1 h-auto py-2"
                      onClick={() => navigateTo(route.path)}
                    >
                      <div>
                        <div className="font-medium">{route.description}</div>
                        <div className="text-xs text-muted-foreground">{route.path}</div>
                      </div>
                    </Button>
                  ))}
                  
                  {Object.entries(writerMetrics).length > 0 && (
                    <>
                      <Separator className="my-3" />
                      <p className="text-sm font-medium mb-2">Recently Visited</p>
                      {Object.entries(writerMetrics)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 3)
                        .map(([path, count], index) => (
                          <Button
                            key={`${path}-${index}`}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-left mb-1"
                            onClick={() => navigateTo(path)}
                          >
                            <div className="flex justify-between items-center w-full">
                              <span className="truncate max-w-[180px]">{path}</span>
                              <span className="bg-muted rounded-full px-2 py-0.5 text-xs">
                                {count}x
                              </span>
                            </div>
                          </Button>
                        ))
                      }
                    </>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          
          {/* Calendar Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="bg-red-100 text-red-800 rounded p-1 mr-3 h-8 w-8 flex items-center justify-center">
                    <span className="font-medium">15</span>
                  </div>
                  <div>
                    <p className="font-medium">Product Update</p>
                    <p className="text-xs text-muted-foreground">Due Apr 15</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-amber-100 text-amber-800 rounded p-1 mr-3 h-8 w-8 flex items-center justify-center">
                    <span className="font-medium">20</span>
                  </div>
                  <div>
                    <p className="font-medium">Weekly Newsletter</p>
                    <p className="text-xs text-muted-foreground">Due Apr 20</p>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => navigateTo('/content/calendar')}
                >
                  View Content Calendar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WriterDashboard;
