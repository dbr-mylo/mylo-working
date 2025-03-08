
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StyleEditorModal } from "./StyleEditorModal";
import { TextStyle } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StyleForm } from "./StyleForm";
import { textStyleStore } from "@/stores/textStyles";
import { useToast } from "@/hooks/use-toast";

export const StyleModalTester = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<TextStyle | null>(null);
  const [directEditMode, setDirectEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("create");
  const { toast } = useToast();
  
  // Sample styles for testing
  const sampleStyles: Record<string, Partial<TextStyle>> = {
    heading: {
      name: "Heading Style",
      fontFamily: "Playfair Display",
      fontSize: "32px",
      fontWeight: "700",
      color: "#333333",
      lineHeight: "1.2",
      letterSpacing: "0px",
      textAlign: "left"
    },
    paragraph: {
      name: "Paragraph Style",
      fontFamily: "Inter",
      fontSize: "16px",
      fontWeight: "400",
      color: "#555555",
      lineHeight: "1.6",
      letterSpacing: "0.5px",
      textAlign: "left"
    },
    accent: {
      name: "Accent Style",
      fontFamily: "Montserrat",
      fontSize: "18px",
      fontWeight: "600",
      color: "#8B5CF6", // Vivid purple
      lineHeight: "1.4",
      letterSpacing: "1px",
      textAlign: "center"
    },
    minimal: {
      name: "Minimal Style",
      fontFamily: "Roboto",
      fontSize: "14px",
      fontWeight: "300",
      color: "#8E9196", // Neutral Gray
      lineHeight: "1.5",
      letterSpacing: "0px",
      textAlign: "left"
    }
  };
  
  const handleOpenModal = (presetStyle: keyof typeof sampleStyles) => {
    const style = sampleStyles[presetStyle];
    setSelectedStyle({
      id: `test-${presetStyle}`,
      ...style as TextStyle
    });
    setIsModalOpen(true);
  };
  
  const handleToggleDirectEdit = () => {
    setDirectEditMode(!directEditMode);
  };
  
  const handleStyleSaved = () => {
    toast({
      title: "Style Saved",
      description: "The style has been saved successfully",
    });
    setIsModalOpen(false);
  };
  
  const handleManualSave = async (styleData: any) => {
    try {
      await textStyleStore.saveTextStyle(styleData);
      toast({
        title: "Style created manually",
        description: "Text style has been saved successfully",
      });
    } catch (error) {
      console.error("Error saving style:", error);
      toast({
        title: "Error",
        description: "Failed to save text style",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Style Modal Testing Tool</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="create">Modal Testing</TabsTrigger>
          <TabsTrigger value="direct">Direct Form Testing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Style Modal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={() => handleOpenModal("heading")}>
                  Open with Heading Style
                </Button>
                <Button onClick={() => handleOpenModal("paragraph")}>
                  Open with Paragraph Style
                </Button>
                <Button onClick={() => handleOpenModal("accent")}>
                  Open with Accent Style
                </Button>
                <Button onClick={() => handleOpenModal("minimal")}>
                  Open with Minimal Style
                </Button>
                <Button onClick={() => {
                  setSelectedStyle(null);
                  setIsModalOpen(true);
                }}>
                  Open Empty Modal (New Style)
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <StyleEditorModal
            style={selectedStyle}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onStyleSaved={handleStyleSaved}
          />
        </TabsContent>
        
        <TabsContent value="direct" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Style Form Directly</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 space-y-2">
                <Button onClick={() => handleOpenModal("heading")} variant="outline" className="mr-2">
                  Load Heading Style
                </Button>
                <Button onClick={() => handleOpenModal("paragraph")} variant="outline" className="mr-2">
                  Load Paragraph Style
                </Button>
                <Button onClick={() => handleOpenModal("accent")} variant="outline" className="mr-2">
                  Load Accent Style
                </Button>
                <Button onClick={() => handleOpenModal("minimal")} variant="outline">
                  Load Minimal Style
                </Button>
              </div>
              
              {selectedStyle && (
                <StyleForm
                  initialValues={selectedStyle}
                  onSubmit={handleManualSave}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
