
import React, { useState } from "react";
import { Folder as FolderType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown, Folder, File, Plus, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface FolderTreeProps {
  folders: FolderType[];
  projectId: string;
}

export const FolderTree: React.FC<FolderTreeProps> = ({ folders, projectId }) => {
  return (
    <div className="space-y-1">
      {folders.length === 0 ? (
        <p className="text-sm text-gray-500 px-2 py-1">No folders yet</p>
      ) : (
        folders
          .filter(folder => folder.parentId === null)
          .map(folder => (
            <FolderTreeItem
              key={folder.id}
              folder={folder}
              folders={folders}
              level={0}
              projectId={projectId}
            />
          ))
      )}
    </div>
  );
};

interface FolderTreeItemProps {
  folder: FolderType;
  folders: FolderType[];
  level: number;
  projectId: string;
}

const FolderTreeItem: React.FC<FolderTreeItemProps> = ({
  folder,
  folders,
  level,
  projectId,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  
  const childFolders = folders.filter(f => f.parentId === folder.id);
  const hasChildren = childFolders.length > 0;
  
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };
  
  const handleAddSubfolder = () => {
    // In a real app, this would show a modal
    toast({
      title: "Coming Soon",
      description: "Adding subfolders will be available soon",
    });
  };
  
  const handleAddDocument = () => {
    // In a real app, this would create a new document in this folder
    toast({
      title: "Coming Soon",
      description: "Adding documents to folders will be available soon",
    });
  };
  
  const handleRename = () => {
    toast({
      title: "Coming Soon",
      description: "Renaming folders will be available soon",
    });
  };
  
  const handleDelete = () => {
    toast({
      title: "Coming Soon",
      description: "Deleting folders will be available soon",
    });
  };
  
  return (
    <>
      <div
        className={cn(
          "flex items-center group",
          level > 0 && `pl-${level * 4}`
        )}
        style={{ paddingLeft: level * 16 }}
      >
        <Button
          variant="ghost"
          size="sm"
          className="p-0 w-6 h-6 mr-1"
          onClick={handleToggle}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          ) : (
            <div className="w-4" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="px-2 py-1 h-7 justify-start flex-1 text-left font-normal"
        >
          <Folder className="h-4 w-4 mr-2 text-gray-500" />
          <span className="truncate">{folder.name}</span>
          <span className="ml-2 text-xs text-gray-500">
            ({folder.items?.length || 0})
          </span>
        </Button>
        
        <div className="opacity-0 group-hover:opacity-100 mr-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleAddSubfolder}>
                <Folder className="h-4 w-4 mr-2" />
                Add Subfolder
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleAddDocument}>
                <File className="h-4 w-4 mr-2" />
                Add Document
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleRename}>
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={handleDelete}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {isExpanded && hasChildren && (
        <div>
          {childFolders.map(childFolder => (
            <FolderTreeItem
              key={childFolder.id}
              folder={childFolder}
              folders={folders}
              level={level + 1}
              projectId={projectId}
            />
          ))}
        </div>
      )}
    </>
  );
};
