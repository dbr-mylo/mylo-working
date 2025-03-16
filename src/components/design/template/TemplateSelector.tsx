
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Template } from "@/lib/types";

interface TemplateSelectorProps {
  templates: Template[];
  selectedTemplate: string | null;
  templateName: string;
  onTemplateNameChange: (name: string) => void;
  onTemplateSelect: (templateId: string) => void;
  onNewTemplate: () => void;
}

export const TemplateSelector = ({ 
  templates, 
  selectedTemplate, 
  templateName, 
  onTemplateNameChange, 
  onTemplateSelect, 
  onNewTemplate 
}: TemplateSelectorProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Input 
          placeholder="Template name" 
          value={templateName}
          onChange={(e) => onTemplateNameChange(e.target.value)}
          className="flex-1"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Select
          value={selectedTemplate || ""}
          onValueChange={onTemplateSelect}
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
        <Button variant="outline" size="sm" onClick={onNewTemplate}>
          New
        </Button>
      </div>
    </div>
  );
};
