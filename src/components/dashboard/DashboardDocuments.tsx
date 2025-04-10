
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DocumentList } from "@/components/document/DocumentList";
import { ProjectList } from "@/components/dashboard/projects/ProjectList";
import { CreateProjectModal } from "@/components/dashboard/projects/CreateProjectModal";
import { useDashboardProjects } from "@/hooks/dashboard/useDashboardProjects";
import { useDocumentsData } from "@/hooks/dashboard/useDocumentsData";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardDocuments = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  const {
    projects,
    selectedProjectId,
    isProjectModalOpen,
    isLoading: projectsLoading,
    setSelectedProjectId,
    createProject,
    deleteProject,
    openCreateProjectModal,
    closeCreateProjectModal
  } = useDashboardProjects();
  
  const {
    documents,
    isLoading: documentsLoading,
    handleDeleteDocument,
    handleSelectDocument,
  } = useDocumentsData(selectedProjectId);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Projects sidebar */}
      <div className="md:col-span-1">
        <ProjectList
          projects={projects}
          onCreateProject={openCreateProjectModal}
          onSelectProject={setSelectedProjectId}
          selectedProjectId={selectedProjectId || undefined}
          className="mb-6"
        />
        
        {projectsLoading && (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        )}
        
        <CreateProjectModal
          isOpen={isProjectModalOpen}
          onClose={closeCreateProjectModal}
          onCreateProject={createProject}
        />
      </div>
      
      {/* Main content */}
      <div className="md:col-span-3">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="all">All Documents</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="shared">Shared with me</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="space-y-4">
            <DocumentList
              documents={documents}
              isLoading={documentsLoading}
              onDeleteDocument={handleDeleteDocument}
              onSelectDocument={handleSelectDocument}
              projectId={selectedProjectId || undefined}
            />
          </TabsContent>
          
          <TabsContent value="recent">
            <DocumentList
              documents={documents.slice(0, 5)} // Just show most recent 5
              isLoading={documentsLoading}
              onDeleteDocument={handleDeleteDocument}
              onSelectDocument={handleSelectDocument}
            />
          </TabsContent>
          
          <TabsContent value="shared">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">
                  Shared documents will appear here (coming soon)
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
