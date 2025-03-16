import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DocumentStyles } from "./preview/DocumentStyles";
import { EditableContent } from "./preview/EditableContent";
import { ViewableContent } from "./preview/ViewableContent";
import { EmptyContent } from "./preview/EmptyContent";
import { SelectedElementBar } from "./preview/SelectedElementBar";
import { useDocumentPreview } from "./preview/useDocumentPreview";
import { Editor } from "@tiptap/react";
import { templateStore } from "@/stores/templateStore";
import { useToast } from "@/hooks/use-toast";
import { extractDimensionsFromCSS, generateDimensionsCSS } from "@/utils/templateUtils";
import { supabase } from "@/integrations/supabase/client";
import { templateService } from "@/services/template";

interface DocumentPreviewProps {
  content: string;
  customStyles: string;
  isEditable: boolean;
  onContentChange?: (content: string) => void;
  onElementSelect?: (element: HTMLElement | null) => void;
  renderToolbarOutside?: boolean;
  externalToolbar?: boolean;
  editorInstance?: Editor | null;
  templateId?: string;
}

export const DocumentPreview = ({ 
  content, 
  customStyles, 
  isEditable, 
  onContentChange,
  onElementSelect,
  renderToolbarOutside = false,
  externalToolbar = false,
  editorInstance = null,
  templateId = ''
}: DocumentPreviewProps) => {
  const { role, user } = useAuth();
  const { toast } = useToast();
  const isDesigner = role === "designer";
  const isEditor = role === "editor";
  
  const [templateStyles, setTemplateStyles] = useState(customStyles);
  const [templateName, setTemplateName] = useState('');
  const [templateVersion, setTemplateVersion] = useState(1);
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(null);
  
  useEffect(() => {
    if (templateStyles) {
      const dimensions = extractDimensionsFromCSS(templateStyles);
      
      if (!dimensions) {
        const defaultDimensionsCSS = generateDimensionsCSS();
        setTemplateStyles(prev => prev + defaultDimensionsCSS);
      }
    }
  }, [templateStyles]);
  
  const {
    previewRef,
    selectedElement,
    handlePreviewClick,
    handleApplyStyle
  } = useDocumentPreview(onElementSelect);
  
  useEffect(() => {
    const loadTemplate = async () => {
      if (templateId && isEditor) {
        setIsTemplateLoading(true);
        try {
          const { data: template, error } = await supabase
            .from('design_templates')
            .select('*')
            .eq('id', templateId)
            .eq('status', 'published')
            .single();
          
          if (error) throw error;
          
          if (template) {
            let styles = template.styles;
            
            const dimensions = extractDimensionsFromCSS(styles);
            if (!dimensions) {
              styles += generateDimensionsCSS();
            }
            
            setTemplateStyles(styles);
            setTemplateName(template.name);
            setTemplateVersion(template.version || 1);
            
            await templateStore.saveTemplate({
              id: template.id,
              name: template.name,
              styles: template.styles,
              status: template.status as 'draft' | 'published',
              category: template.category,
              version: template.version
            });
            
            if (user?.id && documentId) {
              try {
                const { data: existingRelation } = await supabase
                  .from('document_templates')
                  .select('id')
                  .eq('document_id', documentId)
                  .eq('template_id', templateId)
                  .single();
                
                if (!existingRelation) {
                  await supabase
                    .from('document_templates')
                    .insert({
                      document_id: documentId,
                      template_id: templateId,
                      template_version: template.version || 1
                    });
                } else {
                  await supabase
                    .from('document_templates')
                    .update({
                      template_version: template.version || 1,
                      applied_at: new Date().toISOString()
                    })
                    .eq('document_id', documentId)
                    .eq('template_id', templateId);
                }
              } catch (e) {
                console.error("Error recording template usage:", e);
              }
            }
          }
        } catch (error) {
          console.error("Error loading template:", error);
        } finally {
          setIsTemplateLoading(false);
        }
      } else if (isDesigner) {
        setTemplateStyles(customStyles);
      }
    };
    
    loadTemplate();
  }, [templateId, customStyles, isEditor, isDesigner, user, documentId]);
  
  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/editor\/([^\/]+)/);
    if (match && match[1]) {
      setDocumentId(match[1]);
    }
  }, []);
  
  const handleContentChange = (newContent: string) => {
    if (onContentChange) {
      onContentChange(newContent);
    }
  };
  
  const dimensions = extractDimensionsFromCSS(templateStyles);
  
  return (
    <div className="bg-editor-panel rounded-md">
      {!isEditable && selectedElement && (
        <SelectedElementBar 
          selectedElement={selectedElement}
          onApplyStyle={handleApplyStyle}
        />
      )}
      
      <div className="prose prose-sm max-w-none">
        <DocumentStyles customStyles={isEditable ? '' : templateStyles} />
        
        {isEditable ? (
          <EditableContent
            content={content}
            onContentChange={handleContentChange}
            hideToolbar={isDesigner}
            renderToolbarOutside={renderToolbarOutside}
            externalToolbar={externalToolbar}
            editorInstance={editorInstance}
            templateStyles={templateStyles}
          />
        ) : content ? (
          <ViewableContent
            content={content}
            previewRef={previewRef}
            onClick={handlePreviewClick}
            templateStyles={templateStyles}
            templateName={templateName}
            templateVersion={templateVersion}
            templateId={templateId}
          />
        ) : (
          <EmptyContent dimensions={dimensions} />
        )}
      </div>
    </div>
  );
};
