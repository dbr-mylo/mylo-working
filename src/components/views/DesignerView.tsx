
import React from "react";
import { DesignPanel } from "@/components/DesignPanel";
import { useIsDesigner, useIsDesignerOrAdmin } from "@/utils/roles";

interface DesignerViewProps {
  content: string;
  isDesignEditable: boolean;
  templateId?: string;
}

export const DesignerView: React.FC<DesignerViewProps> = ({
  content,
  isDesignEditable,
  templateId
}) => {
  const isDesignerOrAdmin = useIsDesignerOrAdmin();
  
  if (!isDesignerOrAdmin) {
    console.warn("DesignerView used outside of designer or admin role context");
    return null;
  }
  
  return (
    <DesignPanel 
      content={content}
      isEditable={isDesignEditable}
      templateId={templateId}
    />
  );
};
