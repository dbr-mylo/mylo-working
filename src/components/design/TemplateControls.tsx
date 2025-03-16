
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useIsDesignerOrAdmin } from "@/utils/roles/RoleHooks";
import { TemplateSelector } from "./template/TemplateSelector";
import { TemplateStatus } from "./template/TemplateStatus";
import { TemplateCategory } from "./template/TemplateCategory";
import { TemplateDimensions } from "./template/TemplateDimensions";
import { TemplateStyles } from "./template/TemplateStyles";
import { useTemplateControls } from "./template/useTemplateControls";

interface TemplateControlsProps {
  onStylesChange: (styles: string) => void;
}

export const TemplateControls = ({ onStylesChange }: TemplateControlsProps) => {
  const canPublish = useIsDesignerOrAdmin();
  const {
    templateName,
    setTemplateName,
    selectedTemplate,
    templates,
    customStyles,
    width,
    setWidth,
    height,
    setHeight,
    status,
    category,
    setCategory,
    handleTemplateChange,
    handleStylesChange,
    handleDimensionsChange,
    handleToggleStatus,
    saveTemplate,
    handleNewTemplate
  } = useTemplateControls(onStylesChange);
  
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
      <h3 className="text-sm font-medium mb-3">Template Controls</h3>
      <div className="space-y-3">
        <TemplateSelector
          templates={templates}
          selectedTemplate={selectedTemplate}
          templateName={templateName}
          onTemplateNameChange={setTemplateName}
          onTemplateSelect={handleTemplateChange}
          onNewTemplate={handleNewTemplate}
        />
        
        <div className="flex items-center gap-2 mt-2">
          <Button size="sm" onClick={saveTemplate} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
        
        <TemplateStatus 
          status={status} 
          onToggleStatus={handleToggleStatus} 
          canPublish={canPublish} 
        />
        
        <TemplateCategory 
          category={category} 
          onCategoryChange={setCategory} 
        />
        
        <TemplateDimensions
          width={width}
          height={height}
          onWidthChange={setWidth}
          onHeightChange={setHeight}
          onApplyDimensions={handleDimensionsChange}
        />
        
        <TemplateStyles 
          customStyles={customStyles} 
          onStylesChange={handleStylesChange} 
        />
      </div>
    </div>
  );
};
