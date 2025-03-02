
import type { DesignPanelProps } from "@/lib/types";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useState, useEffect } from "react";
import { RichTextEditor } from "@/components/RichTextEditor";
import { useAuth } from "@/contexts/AuthContext";
import { templateStore } from "@/stores/templateStore";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const DesignPanel = ({ content, isEditable }: DesignPanelProps) => {
  const { width } = useWindowSize();
  const { role } = useAuth();
  const { toast } = useToast();
  const isMobile = width < 1281;
  const [designContent, setDesignContent] = useState(content);
  const [templateName, setTemplateName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templates, setTemplates] = useState<Array<{id: string, name: string, styles: string}>>([]);
  const [customStyles, setCustomStyles] = useState<string>("");
  
  // Update local content when prop changes (for when editor updates content)
  if (content !== designContent && !isEditable) {
    setDesignContent(content);
  }
  
  // Load templates when component mounts
  useEffect(() => {
    const loadTemplates = async () => {
      const loadedTemplates = await templateStore.getTemplates();
      setTemplates(loadedTemplates);
      
      // Set default template if any exist
      if (loadedTemplates.length > 0 && !selectedTemplate) {
        setSelectedTemplate(loadedTemplates[0].id);
        setCustomStyles(loadedTemplates[0].styles);
      }
    };
    
    loadTemplates();
  }, []);
  
  const handleContentChange = (newContent: string) => {
    setDesignContent(newContent);
  };
  
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setCustomStyles(template.styles);
    }
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
  };
  
  return (
    <div className={`${isMobile ? 'w-full' : 'w-1/2'} p-4 md:p-8 bg-editor-panel ${!isMobile ? 'animate-slide-in' : ''} overflow-auto`}>
      <div className="mx-auto">
        {!isMobile && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-medium text-editor-text">Design Panel</h2>
            {isEditable ? (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Editable
              </span>
            ) : (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                View Only
              </span>
            )}
          </div>
        )}
        
        {role === "designer" && (
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
                  onChange={(e) => setCustomStyles(e.target.value)}
                  placeholder="Enter custom CSS styles"
                  className="w-full h-24 p-2 text-sm font-mono border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-editor-panel p-4 rounded-md">
          <div className="prose prose-sm max-w-none">
            <div 
              className="min-h-[11in] w-[8.5in] p-[1in] mx-auto bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12),_0_1px_2px_rgba(0,0,0,0.24)]"
            >
              <style>
                {`
                  .prose p {
                    margin-top: 0;
                    margin-bottom: 4px;
                    line-height: 1.2;
                  }
                  .prose ul, .prose ol {
                    margin-top: 0;
                    margin-bottom: 0;
                    padding-left: 20px;
                  }
                  .prose li {
                    margin-bottom: 4px;
                    line-height: 1.2;
                  }
                  .prose li p {
                    margin: 0;
                  }
                  .prose ul ul, .prose ol ol, .prose ul ol, .prose ol ul {
                    margin-top: 4px;
                  }
                  .prose li > ul, .prose li > ol {
                    padding-left: 24px;
                  }
                  ${customStyles}
                `}
              </style>
              {isEditable ? (
                <RichTextEditor
                  content={designContent}
                  onUpdate={handleContentChange}
                  isEditable={true}
                  hideToolbar={false}
                />
              ) : content ? (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                <p className="text-editor-text opacity-50">
                  Content from the editor will appear here with brand styling
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
