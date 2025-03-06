
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
    <main className="animate-fade-in h-[calc(100vh-4rem)]">
      <Tabs defaultValue="editor" className="h-full">
        <TabsList className="grid w-full grid-cols-2 mb-2">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="design">Design Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="editor" className="h-[calc(100%-40px)]">
          <EditorPanel 
            content={content}
            onContentChange={onContentChange}
            isEditable={isEditorEditable}
          />
        </TabsContent>
        <TabsContent value="design" className="h-[calc(100%-40px)]">
          <DesignPanel 
            content={content}
            isEditable={isDesignEditable}
          />
        </TabsContent>
      </Tabs>
    </main>
  );
};
