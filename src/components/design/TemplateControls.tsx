
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { templateStore, Template } from "@/stores/templateStore";

interface TemplateControlsProps {
  onStylesChange: (styles: string) => void;
}

export const TemplateControls = ({ onStylesChange }: TemplateControlsProps) => {
  const { toast } = useToast();
  const [templateName, setTemplateName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [customStyles, setCustomStyles] = useState<string>("");
  
  // Load templates when component mounts
  useEffect(() => {
    const loadTemplates = async () => {
      const loadedTemplates = await templateStore.getTemplates();
      setTemplates(loadedTemplates);
      
      // Set default template if any exist
      if (loadedTemplates.length > 0 && !selectedTemplate) {
        setSelectedTemplate(loadedTemplates[0].id);
        setCustomStyles(loadedTemplates[0].styles);
        onStylesChange(loadedTemplates[0].styles);
      }
    };
    
    loadTemplates();
  }, [onStylesChange]);
  
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setCustomStyles(template.styles);
      onStylesChange(template.styles);
    }
  };
  
  const handleStylesChange = (styles: string) => {
    setCustomStyles(styles);
    onStylesChange(styles);
  };
  
  const saveTemplate = async () => {
    if (!templateName.trim()) {
      toast({
        title: "Template name required",
        description: "Please enter a name for your template.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const savedTemplate = await templateStore.saveTemplate({
        id: selectedTemplate || undefined,
        name: templateName,
        styles: customStyles
      });
      
      if (!selectedTemplate) {
        setTemplates([...templates, savedTemplate]);
        setSelectedTemplate(savedTemplate.id);
      } else {
        setTemplates(templates.map(t => t.id === savedTemplate.id ? savedTemplate : t));
      }
      
      toast({
        title: "Template saved",
        description: "Your design template has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving template:", error);
      toast({
        title: "Error saving template",
        description: "There was a problem saving your template.",
        variant: "destructive",
      });
    }
  };
  
  const handleNewTemplate = () => {
    setSelectedTemplate(null);
    setTemplateName("");
    setCustomStyles("");
    onStylesChange("");
  };
  
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
      <h3 className="text-sm font-medium mb-3">Template Controls</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Input 
            placeholder="Template name" 
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="flex-1"
          />
          <Button size="sm" onClick={saveTemplate}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={selectedTemplate || ""}
            onValueChange={handleTemplateChange}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map(template => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleNewTemplate}>
            New
          </Button>
        </div>
        
        <div>
          <textarea
            value={customStyles}
            onChange={(e) => handleStylesChange(e.target.value)}
            placeholder="Enter custom CSS styles"
            className="w-full h-24 p-2 text-sm font-mono border border-gray-300 rounded-md"
          />
        </div>
      </div>
    </div>
  );
};
