
import { useNavigate } from "react-router-dom";
import { DocumentList } from "@/components/document/DocumentList";
import { TemplateHeader } from "@/components/design/template/TemplateHeader";
import { useTemplateManager } from "@/components/design/template/hooks/useTemplateManager";
import { Document } from "@/lib/types";
import { useIsDesigner } from "@/utils/roles";

interface TemplateManagerProps {
  onLoadTemplate?: (doc: Document) => void;
  onClose?: () => void;
}

export const TemplateManager = ({ onLoadTemplate, onClose }: TemplateManagerProps) => {
  const navigate = useNavigate();
  const isDesigner = useIsDesigner();

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
    if (isDesigner) return "All Templates";
    return "Available Templates";
  };

  return (
    <div className="p-4 space-y-4">
      <TemplateHeader 
        title={getTemplateTitle()}
        canManageTemplates={isDesigner}
        onCreateNewTemplate={handleCreateNewTemplate}
      />
      
      <DocumentList
        documents={templates}
        isLoading={isLoading}
        onDeleteDocument={handleDeleteTemplate}
        onSelectDocument={handleSelectTemplate}
        isDesigner={isDesigner}
        showStatus={true}
        onToggleStatus={isDesigner ? handleToggleTemplateStatus : undefined}
      />
    </div>
  );
};
