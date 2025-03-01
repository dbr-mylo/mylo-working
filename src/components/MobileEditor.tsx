
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditorPanel } from "@/components/EditorPanel";
import { DesignPanel } from "@/components/DesignPanel";

type MobileEditorProps = {
  content: string;
  onContentChange: (content: string) => void;
  isEditorEditable: boolean;
  isDesignEditable: boolean;
};

export const MobileEditor = ({ 
  content, 
  onContentChange, 
  isEditorEditable, 
  isDesignEditable 
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
          />
        </TabsContent>
        <TabsContent value="design" className="mt-0">
          <DesignPanel 
            content={content}
            isEditable={isDesignEditable}
          />
        </TabsContent>
      </Tabs>
    </main>
  );
};
