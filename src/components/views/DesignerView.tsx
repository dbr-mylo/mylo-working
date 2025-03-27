
import React from "react";
import { DesignPanel } from "@/components/DesignPanel";

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
  return (
    <DesignPanel 
      content={content}
      isEditable={isDesignEditable}
      templateId={templateId}
    />
  );
};
