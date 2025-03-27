
import React from "react";
import { EditorNav } from "@/components/editor-nav";
import { StyleApplicatorTest } from "@/components/design/typography/StyleApplicatorTest";
import { UserRole } from "@/lib/types";

interface StyleTestViewProps {
  role: UserRole | null;
  handleTitleChange: (title: string) => Promise<void>;
  saveDocument: () => Promise<void>;
}

export const StyleTestView: React.FC<StyleTestViewProps> = ({
  role,
  handleTitleChange,
  saveDocument
}) => {
  return (
    <div className="min-h-screen bg-editor-bg">
      <EditorNav 
        currentRole={role || "writer"} 
        documentTitle="Style Inheritance Test"
        onTitleChange={handleTitleChange}
        onSave={saveDocument}
      />
      <main className="animate-fade-in">
        <StyleApplicatorTest />
      </main>
    </div>
  );
};
