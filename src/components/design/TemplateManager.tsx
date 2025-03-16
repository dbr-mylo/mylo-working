
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Document } from "@/lib/types";
import { fetchUserDocuments } from "@/components/editor-nav/EditorNavUtils";
import { DocumentList } from "@/components/document/DocumentList";
import { Save, FileEdit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  useIsAdmin, 
  useIsDesigner, 
  useIsDesignerOrAdmin 
} from "@/utils/roleSpecificRendering";
import { supabase } from "@/integrations/supabase/client";

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
  const isAdmin = useIsAdmin();
  const isDesigner = useIsDesigner();
  const canManageTemplates = useIsDesignerOrAdmin();

  useEffect(() => {
    loadTemplates();
  }, [user, role]);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      // Use different loading strategy based on role
      if (isAdmin) {
        // Admins can see all templates
        const { data, error } = await supabase
          .from('design_templates')
          .select('id, name, styles, owner_id, status, category, version, created_at, updated_at')
          .order('updated_at', { ascending: false });
          
        if (error) throw error;
        
        // Transform to Document format
        const templateDocs = data.map(template => ({
          id: template.id,
          title: template.name,
          content: template.styles,
          updated_at: template.updated_at,
          meta: {
            template_id: template.id,
            status: template.status,
            category: template.category,
            version: template.version,
            owner_id: template.owner_id
          }
        }));
        
        setTemplates(templateDocs);
      } else if (isDesigner) {
        // Designers see their own templates and published templates
        const { data, error } = await supabase
          .from('design_templates')
          .select('id, name, styles, owner_id, status, category, version, created_at, updated_at')
          .order('updated_at', { ascending: false });
          
        if (error) throw error;
        
        // Transform to Document format
        const templateDocs = data.map(template => ({
          id: template.id,
          title: template.name,
          content: template.styles,
          updated_at: template.updated_at,
          meta: {
            template_id: template.id,
            status: template.status,
            category: template.category,
            version: template.version,
            owner_id: template.owner_id
          }
        }));
        
        setTemplates(templateDocs);
      } else {
        // Editors only see published templates
        const { data, error } = await supabase
          .from('design_templates')
          .select('id, name, styles, owner_id, status, category, version, created_at, updated_at')
          .eq('status', 'published')
          .order('updated_at', { ascending: false });
          
        if (error) throw error;
        
        // Transform to Document format
        const templateDocs = data.map(template => ({
          id: template.id,
          title: template.name,
          content: template.styles,
          updated_at: template.updated_at,
          meta: {
            template_id: template.id,
            status: template.status,
            category: template.category,
            version: template.version
          }
        }));
        
        setTemplates(templateDocs);
      }
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
    
    try {
      // Check if any documents are using this template
      const { data: usageData, error: usageError } = await supabase
        .from('document_templates')
        .select('document_id')
        .eq('template_id', templateId);
        
      if (usageError) throw usageError;
      
      if (usageData && usageData.length > 0) {
        // Template is in use
        toast({
          title: "Cannot delete template",
          description: `This template is currently used by ${usageData.length} document(s).`,
          variant: "destructive",
        });
        return;
      }
      
      // Delete the template
      const { error } = await supabase
        .from('design_templates')
        .delete()
        .eq('id', templateId);
        
      if (error) throw error;
      
      // Update the local state
      setTemplates(templates.filter(template => template.id !== templateId));
      
      toast({
        title: "Template deleted",
        description: "The template has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting template:", error);
      toast({
        title: "Error deleting template",
        description: "There was a problem deleting the template.",
        variant: "destructive",
      });
    }
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

  const handleToggleTemplateStatus = async (templateId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      
      // Update the template status
      const { error } = await supabase
        .from('design_templates')
        .update({ status: newStatus })
        .eq('id', templateId);
        
      if (error) throw error;
      
      // Update local state
      setTemplates(templates.map(template => 
        template.id === templateId 
          ? { 
              ...template, 
              meta: { 
                ...template.meta, 
                status: newStatus 
              } 
            } 
          : template
      ));
      
      toast({
        title: `Template ${newStatus === 'published' ? 'published' : 'unpublished'}`,
        description: `The template is now ${newStatus === 'published' ? 'available to editors' : 'only visible to you'}.`,
      });
    } catch (error) {
      console.error("Error updating template status:", error);
      toast({
        title: "Error updating template",
        description: "There was a problem updating the template status.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium">
          {isAdmin 
            ? "All Templates" 
            : isDesigner 
              ? "Your Templates" 
              : "Available Templates"}
        </h2>
        
        {canManageTemplates && (
          <Button
            onClick={handleCreateNewTemplate}
            variant="default"
            className="flex items-center gap-2 bg-black text-white hover:bg-black/80"
          >
            <Plus className="h-4 w-4" />
            New Template
          </Button>
        )}
      </div>
      
      <DocumentList
        documents={templates}
        isLoading={isLoading}
        onDeleteDocument={handleDeleteTemplate}
        onSelectDocument={handleSelectTemplate}
        isDesigner={canManageTemplates}
        showStatus={true}
        onToggleStatus={canManageTemplates ? handleToggleTemplateStatus : undefined}
      />
    </div>
  );
};
