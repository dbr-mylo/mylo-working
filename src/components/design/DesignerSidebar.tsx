
import { DesignerSidebarContainer } from "./DesignerSidebarContainer";
import { useState } from "react";
import { TextStyle } from "@/lib/types";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StylesList } from "./typography/StylesList";
import { StyleEditorModal } from "./typography/StyleEditorModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StyleModalTester } from "./typography/StyleModalTester";

interface DesignerSidebarProps {
  children?: React.ReactNode;
}

export const DesignerSidebar = ({ children }: DesignerSidebarProps) => {
  const [isStyleEditorOpen, setIsStyleEditorOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<TextStyle | null>(null);
  const [activeTab, setActiveTab] = useState("styles");

  const handleNewStyle = () => {
    setSelectedStyle(null); // Clear any selected style
    setIsStyleEditorOpen(true);
  };

  const handleEditStyle = (style: TextStyle) => {
    setSelectedStyle(style);
    setIsStyleEditorOpen(true);
  };

  const handleStyleSaved = () => {
    // Force refresh of the styles list
    setSelectedStyle(null);
  };

  return (
    <div className="w-64 bg-editor-sidebar border-l border-editor-border p-4">
      {children}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-4">
          <TabsTrigger value="styles">Styles</TabsTrigger>
          <TabsTrigger value="tester">Test Modal</TabsTrigger>
        </TabsList>
        
        <TabsContent value="styles">
          <DesignerSidebarContainer 
            title="Styles" 
            menuOptions={[
              { label: "New Style", onClick: handleNewStyle }
            ]}
          >
            <div className="mb-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start" 
                onClick={handleNewStyle}
              >
                <PlusIcon className="h-3 w-3 mr-2" />
                <span className="text-xs">New Style</span>
              </Button>
            </div>
            
            <StylesList onEditStyle={handleEditStyle} />
          </DesignerSidebarContainer>
          
          <StyleEditorModal
            style={selectedStyle}
            isOpen={isStyleEditorOpen}
            onClose={() => setIsStyleEditorOpen(false)}
            onStyleSaved={handleStyleSaved}
          />
          
          <DesignerSidebarContainer title="Settings">
            <p className="text-xs text-editor-text">No settings available yet</p>
          </DesignerSidebarContainer>
        </TabsContent>
        
        <TabsContent value="tester">
          <StyleModalTester />
        </TabsContent>
      </Tabs>
    </div>
  );
}
