
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Folder, ChevronRight, File, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Project } from "@/lib/types";
import { useNavigationHandlers } from "@/hooks/navigation/useNavigationHandlers";

interface ProjectListProps {
  projects: Project[];
  onCreateProject: () => void;
  onSelectProject: (projectId: string) => void;
  selectedProjectId?: string;
  className?: string;
}

export const ProjectList = ({
  projects,
  onCreateProject,
  onSelectProject,
  selectedProjectId,
  className = ""
}: ProjectListProps) => {
  const { navigateTo } = useNavigationHandlers();
  
  if (projects.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-500">Projects</h3>
          <Button variant="ghost" size="sm" onClick={onCreateProject}>
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </div>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Folder className="h-12 w-12 text-gray-400 mb-3" />
            <h3 className="font-medium text-gray-600 mb-1">No projects yet</h3>
            <p className="text-sm text-gray-500 mb-4">
              Organize your documents in projects
            </p>
            <Button onClick={onCreateProject}>
              <Plus className="h-4 w-4 mr-1" />
              Create Project
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-500">Projects</h3>
        <Button variant="ghost" size="sm" onClick={onCreateProject}>
          <Plus className="h-4 w-4 mr-1" />
          New
        </Button>
      </div>
      
      <div className="space-y-1">
        {projects.map((project) => (
          <div 
            key={project.id}
            className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
              selectedProjectId === project.id ? 'bg-blue-50' : 'hover:bg-gray-100'
            }`}
            onClick={() => onSelectProject(project.id)}
          >
            <div className="flex items-center">
              <Folder className={`h-4 w-4 mr-2 ${selectedProjectId === project.id ? 'text-blue-600' : 'text-gray-500'}`} />
              <span className={selectedProjectId === project.id ? 'font-medium text-blue-600' : ''}>{project.name}</span>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-gray-500 mr-2">{project.documentCount}</span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
