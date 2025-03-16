
import { useNavigate } from "react-router-dom";
import { DocumentList } from "@/components/document/DocumentList";
import { TemplateHeader } from "@/components/design/template/TemplateHeader";
import { useTemplateManager } from "@/components/design/template/hooks/useTemplateManager";
import { Document } from "@/lib/types";
import { 
  useIsAdmin, 
  useIsDesigner, 
  useIsDesignerOrAdmin 
} from "@/utils/roleSpecificRendering";

interface TemplateManagerProps {
  onLoadTemplate?: (doc: Document) => void;
  onClose?: () => void;
}

export const TemplateManager = ({ onLoadTemplate, onClose }: TemplateManagerProps) => {
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();
  const isDesigner = useIsDesigner();
  const canManageTemplates = useIsDesignerOrAdmin();

  const {
    templates,
    isLoading,
    handleDeleteTemplate,
    handleSelectTemplate,
    handleToggleTemplateStatus
  } = useTemplateManager(onLoadTemplate, onClose);

  const handleCreateNewTemplate = () => {
    navigate('/editor');
  };

  const getTemplateTitle = () => {
    if (isAdmin) return "All Templates";
    if (isDesigner) return "Your Templates";
    return "Available Templates";
  };

  return (
    <div className="p-4 space-y-4">
      <TemplateHeader 
        title={getTemplateTitle()}
        canManageTemplates={canManageTemplates}
        onCreateNewTemplate={handleCreateNewTemplate}
      />
      
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
