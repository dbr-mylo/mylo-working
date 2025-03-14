
import { useState, useEffect } from "react";
import { EditorPanel } from "@/components/EditorPanel";
import { DesignPanel } from "@/components/DesignPanel";
import { useToast } from "@/hooks/use-toast";

type DesktopEditorProps = {
  content: string;
  onContentChange: (content: string) => void;
  isEditorEditable: boolean;
  isDesignEditable: boolean;
  templateId?: string;
};

export const DesktopEditor = ({ 
  content, 
  onContentChange, 
  isEditorEditable, 
  isDesignEditable,
  templateId
}: DesktopEditorProps) => {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] animate-fade-in">
      <EditorPanel 
        content={content}
        onContentChange={onContentChange}
        isEditable={isEditorEditable}
      />
      <DesignPanel 
        content={content}
        isEditable={isDesignEditable}
        templateId={templateId}
      />
    </main>
  );
};
