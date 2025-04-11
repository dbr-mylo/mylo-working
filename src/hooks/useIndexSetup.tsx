
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDocument } from "@/hooks/document";
import { Editor } from "@tiptap/react";
import { useEditorSetup } from "@/components/rich-text/useEditor";
import { useIsWriter, useIsDesigner } from "@/utils/roles";
import { textStyleStore } from "@/stores/textStyles";

export const useIndexSetup = () => {
  const { documentId } = useParams();
  const { role } = useAuth();
  
  // Use role hooks
  const isDesigner = useIsDesigner();
  const isWriter = useIsWriter();
  
  // State for template ID and shared editor instance
  const [templateId, setTemplateId] = useState<string | undefined>(undefined);
  const [editorInstance, setEditorInstance] = useState<Editor | null>(null);
  
  // Check if this is the style test route
  const isStyleTestRoute = documentId === "style-test";
  
  const {
    content,
    setContent,
    initialContent,
    documentTitle,
    setDocumentTitle,
    saveDocument,
    loadDocument,
    isLoading,
    documentMeta,
    currentDocumentId
  } = useDocument(documentId);
  
  // When document metadata is loaded, extract template ID
  useEffect(() => {
    if (documentMeta && documentMeta.template_id) {
      setTemplateId(documentMeta.template_id);
    }
  }, [documentMeta]);
  
  // Determine editability based on user role
  const isEditorEditable = isWriter;
  const isDesignEditable = isDesigner;
  
  // Initialize editor setup for the shared toolbar
  const editorSetup = useEditorSetup({
    content: content || '',
    onContentChange: setContent,
    isEditable: isEditorEditable
  });
  
  // Store the editor instance for sharing when available
  useEffect(() => {
    if (editorSetup.editor) {
      console.log("Setting editor instance in useIndexSetup");
      setEditorInstance(editorSetup.editor);
    } else {
      console.log("Editor instance not available yet in useIndexSetup");
    }
    
    // Clean up editor instance on unmount
    return () => {
      if (editorSetup.editor) {
        console.log("Cleaning up editor instance in useIndexSetup");
      }
    };
  }, [editorSetup.editor]);
  
  // Add a console log to track content changes
  useEffect(() => {
    console.log("Current document content in Index:", content ? `Length: ${content.length}, Preview: ${content.substring(0, 50)}...` : "empty");
  }, [content]);
  
  // Create a Promise-returning wrapper for setDocumentTitle
  const handleTitleChange = async (title: string): Promise<void> => {
    setDocumentTitle(title);
    return Promise.resolve();
  };
  
  // Clear editor cache on component mount to reset problematic styles
  useEffect(() => {
    try {
      console.log("Performing initial cache cleanup");
      // Standard cleanup
      textStyleStore.clearDefaultResetStyle();
      textStyleStore.clearEditorCache();
      
      // Get localStorage size estimate
      let totalSize = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key) || '';
          totalSize += (key.length + value.length) * 2; // Unicode chars are 2 bytes
        }
      }
      console.log(`Current localStorage size estimate: ${totalSize / 1024} KB`);
      
      // Deep clean if localStorage is getting large or we have many items
      if (totalSize > 100000 || localStorage.length > 10) {
        console.log("Performing deep clean due to large localStorage size");
        textStyleStore.deepCleanStorage();
      }
      
      console.log("Index component rendered with documentId:", documentId);
      console.log("Role:", role, "isWriter:", isWriter, "isDesigner:", isDesigner);
      console.log("Initial content:", content ? `Length: ${content.length}` : "empty");
    } catch (error) {
      console.error("Error clearing cache on mount:", error);
    }
  }, []);

  return {
    role,
    documentId,
    isStyleTestRoute,
    isLoading,
    content,
    setContent,
    initialContent,
    documentTitle,
    handleTitleChange,
    saveDocument,
    loadDocument,
    isDesigner,
    isWriter,
    isEditorEditable,
    isDesignEditable,
    templateId,
    setTemplateId,
    editorInstance,
    editorSetup,
    currentDocumentId
  };
};
