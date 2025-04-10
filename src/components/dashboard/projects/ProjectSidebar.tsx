
import React, { useState } from "react";
import { ProjectList } from "@/components/dashboard/projects/ProjectList";
import { FolderTree } from "@/components/dashboard/projects/FolderTree";
import { CreateProjectModal } from "@/components/dashboard/projects/CreateProjectModal";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Project } from "@/lib/types";

interface ProjectSidebarProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (projectId: string | null) => void;
  onCreateProject: (name: string, description?: string) => Promise<void>;
  onCreateFolder: (projectId: string, folderName: string) => Promise<void>;
  projectsLoading: boolean;
}

export const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  projects,
  selectedProject,
  onSelectProject,
  onCreateProject,
  onCreateFolder,
  projectsLoading,
}) => {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const { toast } = useToast();

  const handleCreateProject = async (name: string, description?: string) => {
    try {
      await onCreateProject(name, description);
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
    
    await onCreateFolder(selectedProject.id, folderName);
  };

  return (
    <div>
      <ProjectList
        projects={projects}
        onCreateProject={() => setIsProjectModalOpen(true)}
        onSelectProject={(projectId) => onSelectProject(projectId || null)}
        selectedProjectId={selectedProject?.id}
        className="mb-6"
        isLoading={projectsLoading}
      />
      
      {selectedProject && selectedProject.folders && (
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
            folders={selectedProject.folders}
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
  );
};
