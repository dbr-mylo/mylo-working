
import { useState, useEffect } from "react";
import { Template } from "@/lib/types";
import { templateStore } from "@/stores/templateStore";
import { useToast } from "@/hooks/use-toast";
import { extractDimensionsFromCSS, generateDimensionsCSS } from "@/utils/templateUtils";

export const useTemplateControls = (onStylesChange: (styles: string) => void) => {
  const { toast } = useToast();
  const [templateName, setTemplateName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [customStyles, setCustomStyles] = useState<string>("");
  const [width, setWidth] = useState<string>("8.5in");
  const [height, setHeight] = useState<string>("11in");
  const [status, setStatus] = useState<string>("draft");
  const [category, setCategory] = useState<string>("general");

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

  return {
    templateName,
    setTemplateName,
    selectedTemplate,
    templates,
    customStyles,
    width,
    setWidth,
    height,
    setHeight,
    status,
    category,
    setCategory,
    handleTemplateChange,
    handleStylesChange,
    handleDimensionsChange,
    handleToggleStatus,
    saveTemplate,
    handleNewTemplate
  };
};
