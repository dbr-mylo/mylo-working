
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DocumentList } from "@/components/document/DocumentList";
import { ProjectList } from "@/components/dashboard/projects/ProjectList";
import { CreateProjectModal } from "@/components/dashboard/projects/CreateProjectModal";
import { useProjects } from "@/contexts/ProjectsContext";
import { useDocumentsData } from "@/hooks/dashboard/useDocumentsData";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { FolderTree } from "@/components/dashboard/projects/FolderTree";
import { PlusIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Document } from "@/lib/types";
import { EmptyStatePrompt } from "@/components/dashboard/EmptyStatePrompt";

interface DashboardDocumentsProps {
  searchQuery?: string;
}

export const DashboardDocuments: React.FC<DashboardDocumentsProps> = ({ searchQuery = "" }) => {
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();
  
  const {
    projects,
    selectedProject,
    isLoading: projectsLoading,
    selectProject,
    createProject,
    deleteProject,
    createFolder,
  } = useProjects();
  
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  
  const {
    documents,
    isLoading: documentsLoading,
    handleDeleteDocument,
    handleSelectDocument,
    handleAddDocument,
  } = useDocumentsData(selectedProject?.id || null, searchQuery);

  // Filter documents based on the active tab
  const getFilteredDocuments = () => {
    if (activeTab === 'all') {
      return documents;
    } else if (activeTab === 'recent') {
      return documents
        .sort((a, b) => {
          const dateA = a.updatedAt || a.createdAt || '';
          const dateB = b.updatedAt || b.createdAt || '';
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        })
        .slice(0, 5);
    } else if (activeTab === 'shared') {
      // In a real app, we would filter by shared documents
      return [];
    }
    return documents;
  };
  
  const handleCreateProject = async (name: string, description?: string) => {
    try {
      const newProject = await createProject(name, description);
      selectProject(newProject.id);
      setActiveTab('all');
    } catch (error) {
      toast({
        title: "Failed to create project",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleCreateFolder = async () => {
    if (!selectedProject) {
      toast({
        title: "No project selected",
        description: "Please select a project to create a folder",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, we would show a modal to get the folder name
    const folderName = prompt("Enter folder name");
    if (!folderName) return;
    
    await createFolder(selectedProject.id, folderName);
  };
  
  // Check if we should show empty state
  const showEmptyState = !documentsLoading && documents.length === 0 && !searchQuery;
  const filteredDocuments = getFilteredDocuments();
  const isSearching = searchQuery.trim().length > 0;
  
  // Update active tab when search query changes
  useEffect(() => {
    if (isSearching && activeTab !== 'all') {
      setActiveTab('all');
    }
  }, [searchQuery, isSearching]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Projects sidebar */}
      <div className="md:col-span-1">
        <ProjectList
          projects={projects}
          onCreateProject={() => setIsProjectModalOpen(true)}
          onSelectProject={(projectId) => selectProject(projectId || null)}
          selectedProjectId={selectedProject?.id}
          className="mb-6"
          isLoading={projectsLoading}
        />
        
        {selectedProject && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-900">Folders</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleCreateFolder}
              >
                <PlusIcon className="h-4 w-4" />
                <span className="sr-only">Create Folder</span>
              </Button>
            </div>
            
            <FolderTree
              folders={selectedProject.folders || []}
              projectId={selectedProject.id}
            />
          </div>
        )}
        
        <CreateProjectModal
          isOpen={isProjectModalOpen}
          onClose={() => setIsProjectModalOpen(false)}
          onCreateProject={handleCreateProject}
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
            
            <Button
              onClick={() => handleAddDocument()}
              size="sm"
              className="ml-auto"
            >
              New Document
            </Button>
          </div>
          
          <TabsContent value="all" className="space-y-4">
            {showEmptyState ? (
              <EmptyStatePrompt
                title="No documents yet"
                description="Create your first document to get started"
                buttonText="Create Document"
                onClick={() => handleAddDocument()}
              />
            ) : isSearching && filteredDocuments.length === 0 ? (
              <EmptyStatePrompt
                title="No results found"
                description={`No documents matching "${searchQuery}"`}
                buttonText="Clear Search"
                onClick={() => window.location.href = '/'}
              />
            ) : (
              <DocumentList
                documents={filteredDocuments}
                isLoading={documentsLoading}
                onDeleteDocument={handleDeleteDocument}
                onSelectDocument={handleSelectDocument}
                projectId={selectedProject?.id || null}
              />
            )}
          </TabsContent>
          
          <TabsContent value="recent">
            <DocumentList
              documents={filteredDocuments}
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
