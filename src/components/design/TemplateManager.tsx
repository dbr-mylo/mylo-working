
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Document } from "@/lib/types";
import { fetchUserDocuments } from "@/components/editor-nav/EditorNavUtils";
import { DocumentList } from "@/components/document/DocumentList";
import { Save, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface TemplateManagerProps {
  onLoadTemplate?: (doc: Document) => void;
  onClose?: () => void;
}

export const TemplateManager = ({ onLoadTemplate, onClose }: TemplateManagerProps) => {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, [user]);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const docs = await fetchUserDocuments(user?.id, "designer");
      setTemplates(docs);
    } catch (error) {
      console.error("Error loading templates:", error);
      toast({
        title: "Error loading templates",
        description: "There was a problem loading your templates.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTemplate = async (e: React.MouseEvent, templateId: string) => {
    e.stopPropagation();
    // Implement template deletion logic here
    // For now, just filter out the deleted template
    setTemplates(templates.filter(template => template.id !== templateId));
    toast({
      title: "Template deleted",
      description: "The template has been deleted successfully.",
    });
  };

  const handleSelectTemplate = (templateId: string) => {
    const selectedTemplate = templates.find(template => template.id === templateId);
    if (selectedTemplate && onLoadTemplate) {
      onLoadTemplate(selectedTemplate);
      if (onClose) onClose();
    } else {
      navigate(`/editor/${templateId}`);
    }
  };

  const handleCreateNewTemplate = () => {
    navigate('/editor');
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium">Your Templates</h2>
        <Button
          onClick={handleCreateNewTemplate}
          variant="default"
          className="flex items-center gap-2"
        >
          <FileEdit className="h-4 w-4" />
          New Template
        </Button>
      </div>
      
      <DocumentList
        documents={templates}
        isLoading={isLoading}
        onDeleteDocument={handleDeleteTemplate}
        onSelectDocument={handleSelectTemplate}
        isDesigner={true}
      />
    </div>
  );
};
