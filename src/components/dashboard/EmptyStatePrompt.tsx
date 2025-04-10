
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { File, FolderPlus, Search } from "lucide-react";

interface EmptyStatePromptProps {
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
  icon?: "document" | "folder" | "search";
}

export const EmptyStatePrompt: React.FC<EmptyStatePromptProps> = ({
  title,
  description,
  buttonText,
  onClick,
  icon = "document"
}) => {
  const renderIcon = () => {
    switch (icon) {
      case "document":
        return <File className="h-12 w-12 text-gray-300 mb-4" />;
      case "folder":
        return <FolderPlus className="h-12 w-12 text-gray-300 mb-4" />;
      case "search":
        return <Search className="h-12 w-12 text-gray-300 mb-4" />;
      default:
        return <File className="h-12 w-12 text-gray-300 mb-4" />;
    }
  };

  return (
    <Card className="border-dashed">
      <CardContent className="py-12 text-center">
        <div className="flex flex-col items-center">
          {renderIcon()}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
          <Button onClick={onClick}>{buttonText}</Button>
        </div>
      </CardContent>
    </Card>
  );
};
