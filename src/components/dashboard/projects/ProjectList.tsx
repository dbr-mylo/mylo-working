import React from "react";
import { Project } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { PlusCircle, Folder, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface ProjectListProps {
  projects: Project[];
  onCreateProject: () => void;
  onSelectProject: (projectId: string | undefined) => void;
  selectedProjectId?: string;
  className?: string;
  isLoading?: boolean;
}

export const ProjectList = ({
  projects,
  onCreateProject,
  onSelectProject,
  selectedProjectId,
  className = "",
  isLoading = false
}: ProjectListProps) => {
  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-medium text-gray-900">Projects</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={onCreateProject}
              >
                <PlusCircle className="h-4 w-4" />
                <span className="sr-only">Create Project</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create New Project</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSelectProject(undefined)}
          className={cn(
            "w-full justify-start px-2 text-gray-600 hover:bg-gray-100 font-normal",
            !selectedProjectId && "bg-gray-100 text-gray-900 font-medium"
          )}
        >
          All Documents
        </Button>
        
        {isLoading ? (
          <div className="space-y-2 py-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-gray-100 animate-pulse rounded-md" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <p className="text-sm text-gray-500 p-2">No projects yet</p>
        ) : (
          projects.map((project) => (
            <Button
              key={project.id}
              variant="ghost"
              size="sm"
              onClick={() => onSelectProject(project.id)}
              className={cn(
                "w-full justify-between px-2 text-gray-600 hover:bg-gray-100 font-normal group",
                selectedProjectId === project.id && "bg-gray-100 text-gray-900 font-medium"
              )}
            >
              <div className="flex items-center space-x-2">
                <Folder className="h-4 w-4 text-gray-500" />
                <span className="truncate max-w-[120px]">{project.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Badge variant="outline" className="h-5 text-xs bg-gray-50">
                  {project.documents?.length || 0}
                </Badge>
                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-70" />
              </div>
            </Button>
          ))
        )}
      </div>
      
      {!isLoading && (
        <Button
          variant="outline"
          size="sm"
          onClick={onCreateProject}
          className="w-full mt-4"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          New Project
        </Button>
      )}
    </div>
  );
};
