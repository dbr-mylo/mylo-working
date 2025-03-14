
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditorPanel } from "@/components/EditorPanel";
import { DesignPanel } from "@/components/DesignPanel";
import { Editor } from "@tiptap/react";

type MobileEditorProps = {
  content: string;
  onContentChange: (content: string) => void;
  isEditorEditable: boolean;
  isDesignEditable: boolean;
  templateId?: string;
  editorInstance?: Editor | null;
};

export const MobileEditor = ({ 
  content, 
  onContentChange, 
  isEditorEditable, 
  isDesignEditable,
  templateId,
  editorInstance
}: MobileEditorProps) => {
  return (
    <main className="animate-fade-in p-4">
      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="design">Design Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="editor" className="mt-0">
          <EditorPanel 
            content={content}
            onContentChange={onContentChange}
            isEditable={isEditorEditable}
            templateId={templateId}
            editorInstance={editorInstance}
          />
        </TabsContent>
        <TabsContent value="design" className="mt-0">
          <DesignPanel 
            content={content}
            isEditable={isDesignEditable}
            templateId={templateId}
          />
        </TabsContent>
      </Tabs>
    </main>
  );
};
