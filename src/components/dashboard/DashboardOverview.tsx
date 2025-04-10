
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigationHandlers } from "@/hooks/navigation/useNavigationHandlers";
import { Document } from "@/lib/types";
import { Clock, FileText, LayoutTemplate, CheckCircle, PlusIcon, ArrowRight, Edit2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { WriterOnly, DesignerOnly, AdminOnly } from "@/utils/roles/RoleComponents";
import { DocumentCard } from "@/components/dashboard/DocumentCard";

interface DashboardOverviewProps {
  recentDocuments: Document[];
  recentTemplates: Document[];
  isLoading: boolean;
  stats: {
    totalDocuments: number;
    totalTemplates: number;
    recentEdits: number;
    completedDocuments: number;
  };
}

export const DashboardOverview = ({ 
  recentDocuments, 
  recentTemplates,
  isLoading,
  stats 
}: DashboardOverviewProps) => {
  const { role } = useAuth();
  const { navigateTo } = useNavigationHandlers();
  
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to your dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          Manage your documents and templates in one place
        </p>
      </div>
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-blue-600 mr-2" />
              {isLoading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <span className="text-3xl font-bold">{stats.totalDocuments}</span>
              )}
            </div>
          </CardContent>
        </Card>
        
        <WriterOnly>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Completed Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                {isLoading ? (
                  <Skeleton className="h-9 w-16" />
                ) : (
                  <span className="text-3xl font-bold">{stats.completedDocuments}</span>
                )}
              </div>
            </CardContent>
          </Card>
        </WriterOnly>
        
        <DesignerOnly>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <LayoutTemplate className="h-5 w-5 text-purple-600 mr-2" />
                {isLoading ? (
                  <Skeleton className="h-9 w-16" />
                ) : (
                  <span className="text-3xl font-bold">{stats.totalTemplates}</span>
                )}
              </div>
            </CardContent>
          </Card>
        </DesignerOnly>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Recent Edits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-amber-600 mr-2" />
              {isLoading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <span className="text-3xl font-bold">{stats.recentEdits}</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <WriterOnly>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col gap-2">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <PlusIcon className="h-5 w-5 text-blue-700" />
                </div>
                <h3 className="font-semibold">Create Document</h3>
                <p className="text-sm text-gray-600">Start with a blank document</p>
                <Button 
                  variant="ghost"
                  className="mt-2 flex items-center justify-between"
                  onClick={() => navigateTo("/editor")}
                >
                  <span>Create</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </WriterOnly>
          
          <WriterOnly>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col gap-2">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                  <LayoutTemplate className="h-5 w-5 text-purple-700" />
                </div>
                <h3 className="font-semibold">Use Template</h3>
                <p className="text-sm text-gray-600">Start from a template</p>
                <Button 
                  variant="ghost"
                  className="mt-2 flex items-center justify-between"
                  onClick={() => navigateTo("/templates")}
                >
                  <span>Browse</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </WriterOnly>
          
          <DesignerOnly>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col gap-2">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                  <LayoutTemplate className="h-5 w-5 text-purple-700" />
                </div>
                <h3 className="font-semibold">Create Template</h3>
                <p className="text-sm text-gray-600">Design a new template</p>
                <Button 
                  variant="ghost"
                  className="mt-2 flex items-center justify-between"
                  onClick={() => navigateTo("/design/templates")}
                >
                  <span>Create</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </DesignerOnly>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex flex-col gap-2">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <Edit2 className="h-5 w-5 text-green-700" />
              </div>
              <h3 className="font-semibold">Continue Working</h3>
              <p className="text-sm text-gray-600">Open your recent document</p>
              <Button 
                variant="ghost"
                className="mt-2 flex items-center justify-between"
                onClick={() => recentDocuments.length > 0 && navigateTo(`/editor/${recentDocuments[0].id}`)}
                disabled={recentDocuments.length === 0 || isLoading}
              >
                <span>Open</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Recent Documents Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Documents</h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigateTo("/content/documents")}
          >
            View All
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-3/4 mb-1" />
                  <Skeleton className="h-4 w-1/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recentDocuments.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center">
              <p className="text-gray-500 mb-4">No documents yet</p>
              <Button onClick={() => navigateTo("/editor")}>
                Create Your First Document
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentDocuments.map((doc) => (
              <DocumentCard 
                key={doc.id}
                document={doc}
                onClick={() => navigateTo(`/editor/${doc.id}`)}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Templates Section - Only for Designers & Admins */}
      <DesignerOnly>
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Templates</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigateTo("/design/templates")}
            >
              View All
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-3/4 mb-1" />
                    <Skeleton className="h-4 w-1/3" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : recentTemplates.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center">
                <p className="text-gray-500 mb-4">No templates yet</p>
                <Button onClick={() => navigateTo("/design/templates")}>
                  Create Your First Template
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentTemplates.map((template) => (
                <DocumentCard 
                  key={template.id}
                  document={template}
                  isTemplate
                  onClick={() => navigateTo(`/design/templates/${template.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </DesignerOnly>
    </div>
  );
};
