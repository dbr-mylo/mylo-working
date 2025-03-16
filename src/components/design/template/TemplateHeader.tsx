
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TemplateHeaderProps {
  title: string;
  canManageTemplates: boolean;
  onCreateNewTemplate: () => void;
}

export const TemplateHeader = ({ 
  title, 
  canManageTemplates, 
  onCreateNewTemplate 
}: TemplateHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-medium">{title}</h2>
      
      {canManageTemplates && (
        <Button
          onClick={onCreateNewTemplate}
          variant="default"
          className="flex items-center gap-2 bg-black text-white hover:bg-black/80"
        >
          <Plus className="h-4 w-4" />
          New Template
        </Button>
      )}
    </div>
  );
};
