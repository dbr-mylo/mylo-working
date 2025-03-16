
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, EyeOff, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Switch,
  Label
} from "@/components/ui";
import { templateStore, Template } from "@/stores/templateStore";
import { extractDimensionsFromCSS, generateDimensionsCSS } from "@/utils/templateUtils";
import { useIsDesignerOrAdmin } from "@/utils/roleSpecificRendering";

interface TemplateControlsProps {
  onStylesChange: (styles: string) => void;
}

export const TemplateControls = ({ onStylesChange }: TemplateControlsProps) => {
  const { toast } = useToast();
  const [templateName, setTemplateName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [customStyles, setCustomStyles] = useState<string>("");
  const [width, setWidth] = useState<string>("8.5in");
  const [height, setHeight] = useState<string>("11in");
  const [status, setStatus] = useState<string>("draft");
  const [category, setCategory] = useState<string>("general");
  const canPublish = useIsDesignerOrAdmin();
  
  // Load templates when component mounts
  useEffect(() => {
    const loadTemplates = async () => {
      const loadedTemplates = await templateStore.getTemplates();
      setTemplates(loadedTemplates);
      
      // Set default template if any exist
      if (loadedTemplates.length > 0 && !selectedTemplate) {
        setSelectedTemplate(loadedTemplates[0].id);
        setTemplateName(loadedTemplates[0].name);
        setCustomStyles(loadedTemplates[0].styles);
        setStatus(loadedTemplates[0].status || "draft");
        setCategory(loadedTemplates[0].category || "general");
        onStylesChange(loadedTemplates[0].styles);
        
        // Extract dimensions if available
        const dimensions = extractDimensionsFromCSS(loadedTemplates[0].styles);
        if (dimensions) {
          setWidth(dimensions.width);
          setHeight(dimensions.height);
        }
      }
    };
    
    loadTemplates();
  }, [onStylesChange]);
  
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setTemplateName(template.name);
      setCustomStyles(template.styles);
      setStatus(template.status || "draft");
      setCategory(template.category || "general");
      onStylesChange(template.styles);
      
      // Extract dimensions if available
      const dimensions = extractDimensionsFromCSS(template.styles);
      if (dimensions) {
        setWidth(dimensions.width);
        setHeight(dimensions.height);
      } else {
        // Default dimensions
        setWidth("8.5in");
        setHeight("11in");
      }
    }
  };
  
  const handleStylesChange = (styles: string) => {
    setCustomStyles(styles);
    onStylesChange(styles);
  };
  
  const handleDimensionsChange = () => {
    // Generate dimensions CSS
    const dimensionsCSS = generateDimensionsCSS(width, height);
    
    // Remove any existing dimensions CSS
    let updatedStyles = customStyles.replace(/\.template-styled\s*{\s*width:.*?;\s*height:.*?;\s*min-height:.*?;\s*}/gs, '');
    
    // Add new dimensions CSS
    updatedStyles += dimensionsCSS;
    
    // Update styles
    setCustomStyles(updatedStyles);
    onStylesChange(updatedStyles);
  };
  
  const handleToggleStatus = () => {
    setStatus(prev => prev === "published" ? "draft" : "published");
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
      // Ensure the template has dimensions
      let stylesToSave = customStyles;
      const dimensions = extractDimensionsFromCSS(stylesToSave);
      if (!dimensions) {
        stylesToSave += generateDimensionsCSS(width, height);
      }
      
      const savedTemplate = await templateStore.saveTemplate({
        id: selectedTemplate || undefined,
        name: templateName,
        styles: stylesToSave,
        status,
        category
      });
      
      if (!selectedTemplate) {
        setTemplates([...templates, savedTemplate]);
        setSelectedTemplate(savedTemplate.id);
      } else {
        setTemplates(templates.map(t => t.id === savedTemplate.id ? savedTemplate : t));
      }
      
      toast({
        title: "Template saved",
        description: `Your design template has been saved as ${status === "published" ? "published" : "draft"}.`,
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
    setCustomStyles(generateDimensionsCSS());
    setWidth("8.5in");
    setHeight("11in");
    setStatus("draft");
    setCategory("general");
    onStylesChange(generateDimensionsCSS());
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
                  {template.name} {template.status === "published" ? "(Published)" : "(Draft)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleNewTemplate}>
            New
          </Button>
        </div>
        
        {canPublish && (
          <div className="flex items-center justify-between py-2">
            <Label htmlFor="template-status" className="text-sm">
              Template Status:
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {status === "published" ? "Published" : "Draft"}
              </span>
              <Switch
                id="template-status"
                checked={status === "published"}
                onCheckedChange={handleToggleStatus}
              />
              <span className="text-sm text-gray-400">
                {status === "published" ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </span>
            </div>
          </div>
        )}
        
        <div className="py-2">
          <Label htmlFor="template-category" className="text-sm block mb-1">
            Category
          </Label>
          <Select
            value={category}
            onValueChange={setCategory}
          >
            <SelectTrigger id="template-category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="letter">Letter</SelectItem>
              <SelectItem value="report">Report</SelectItem>
              <SelectItem value="invoice">Invoice</SelectItem>
              <SelectItem value="resume">Resume</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <label className="text-xs text-gray-600 block mb-1">Width</label>
            <Input 
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="8.5in"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-600 block mb-1">Height</label>
            <Input 
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="11in"
            />
          </div>
          <div className="pt-5">
            <Button size="sm" onClick={handleDimensionsChange}>
              Apply
            </Button>
          </div>
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
