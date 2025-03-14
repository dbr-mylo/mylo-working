
import { useState, useEffect } from "react";
import { EditorPanel } from "@/components/EditorPanel";
import { DesignPanel } from "@/components/DesignPanel";
import { useToast } from "@/hooks/use-toast";
import { Editor } from "@tiptap/react";

type DesktopEditorProps = {
  content: string;
  onContentChange: (content: string) => void;
  isEditorEditable: boolean;
  isDesignEditable: boolean;
  templateId?: string;
  editorInstance?: Editor | null;
};

export const DesktopEditor = ({ 
  content, 
  onContentChange, 
  isEditorEditable, 
  isDesignEditable,
  templateId,
  editorInstance
}: DesktopEditorProps) => {
  return (
    <main className="flex min-h-[calc(100vh-7rem)] animate-fade-in">
      <div className="flex w-full h-full">
        <EditorPanel 
          content={content}
          onContentChange={onContentChange}
          isEditable={isEditorEditable}
          templateId={templateId}
          editorInstance={editorInstance}
        />
        <DesignPanel 
          content={content}
          isEditable={isDesignEditable}
          templateId={templateId}
        />
      </div>
    </main>
  );
};
