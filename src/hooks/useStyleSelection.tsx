
import { useState, useEffect, useCallback } from "react";
import { Editor } from "@tiptap/react";
import { useToast } from "@/hooks/use-toast";

export interface SelectedTextInfo {
  elementType: string;
  hasSelection: boolean;
  selectedText: string;
  cursorPosition: { node: any, offset: number } | null;
  isEmpty: boolean;
}

export const useStyleSelection = (editor: Editor | null) => {
  const [selectedInfo, setSelectedInfo] = useState<SelectedTextInfo>({
    elementType: "",
    hasSelection: false,
    selectedText: "",
    cursorPosition: null,
    isEmpty: true
  });
  const { toast } = useToast();

  // Update selection info when selection changes
  const updateSelectionInfo = useCallback(() => {
    if (!editor) {
      return;
    }

    const { state } = editor;
    const { selection } = state;
    const { empty, from, to } = selection;
    
    // Get the selected text
    const selectedText = empty ? "" : state.doc.textBetween(from, to, " ");
    
    // Get element type
    let elementType = "";
    if (editor.isActive("heading", { level: 1 })) elementType = "h1";
    else if (editor.isActive("heading", { level: 2 })) elementType = "h2";
    else if (editor.isActive("heading", { level: 3 })) elementType = "h3";
    else if (editor.isActive("bulletList")) elementType = "ul";
    else if (editor.isActive("orderedList")) elementType = "ol";
    else if (editor.isActive("listItem")) elementType = "li";
    else if (editor.isActive("paragraph")) elementType = "p";
    else if (editor.isActive("blockquote")) elementType = "blockquote";
    else elementType = "other";

    // Get cursor position (useful for inserting at cursor)
    const node = selection.$anchor.nodeBefore;
    const offset = selection.$anchor.pos;
    const cursorPosition = { node, offset };

    setSelectedInfo({
      elementType,
      hasSelection: !empty,
      selectedText,
      cursorPosition,
      isEmpty: empty
    });

    console.log("Selection updated:", {
      elementType,
      hasSelection: !empty,
      selectedText: selectedText.substring(0, 20),
      empty
    });
  }, [editor]);

  // Subscribe to editor events
  useEffect(() => {
    if (!editor) {
      return;
    }

    // Update on selection change
    editor.on('selectionUpdate', updateSelectionInfo);
    // Also update on document changes
    editor.on('update', updateSelectionInfo);
    
    // Initial update
    updateSelectionInfo();

    return () => {
      editor.off('selectionUpdate', updateSelectionInfo);
      editor.off('update', updateSelectionInfo);
    };
  }, [editor, updateSelectionInfo]);

  // Apply a style to the current selection or at cursor position
  const applyStyle = useCallback((styleProperties: Record<string, any>) => {
    if (!editor) {
      toast({
        title: "No editor available",
        description: "Cannot apply style without an active editor",
        variant: "destructive"
      });
      return false;
    }

    try {
      // Start a transaction
      editor.chain().focus();
      
      // Apply each style property
      Object.entries(styleProperties).forEach(([property, value]) => {
        switch (property) {
          case "fontFamily":
            editor.chain().setFontFamily(value).run();
            break;
          case "fontSize":
            // Convert to px if needed and apply
            const fontSize = typeof value === 'string' && value.endsWith('px') 
              ? value 
              : `${value}px`;
            editor.commands.updateAttributes('textStyle', { fontSize });
            break;
          case "fontWeight":
            editor.commands.updateAttributes('textStyle', { fontWeight: value });
            break;
          case "color":
            editor.chain().setColor(value).run();
            break;
          case "textAlign":
            // Handle text alignment
            if (value === 'left') editor.chain().focus().run();
            else if (value === 'center') editor.chain().focus().run();
            else if (value === 'right') editor.chain().focus().run();
            else if (value === 'justify') editor.chain().focus().run();
            break;
          default:
            // For any other properties, try to apply via TextStyle
            const styleUpdate = { [property]: value };
            editor.commands.updateAttributes('textStyle', styleUpdate);
        }
      });

      toast({
        title: "Style applied",
        description: selectedInfo.hasSelection 
          ? "Applied style to selected text" 
          : "Applied style at cursor position",
      });
      
      return true;
    } catch (error) {
      console.error("Error applying style:", error);
      toast({
        title: "Error applying style",
        description: "Something went wrong while applying the style",
        variant: "destructive"
      });
      return false;
    }
  }, [editor, selectedInfo, toast]);

  // Apply a predefined style from the style library
  const applyTextStyle = useCallback(async (styleId: string) => {
    if (!editor) return false;
    
    try {
      // Import here to avoid circular dependency
      const { textStyleStore } = await import('@/stores/textStyles');
      
      // Get the style with inheritance
      const styleToApply = await textStyleStore.getStyleWithInheritance(styleId);
      
      if (!styleToApply) {
        toast({
          title: "Style not found",
          description: "The selected style could not be found",
          variant: "destructive"
        });
        return false;
      }
      
      // Extract style properties
      const styleProperties: Record<string, any> = {
        fontFamily: styleToApply.fontFamily,
        fontSize: styleToApply.fontSize,
        fontWeight: styleToApply.fontWeight,
        color: styleToApply.color,
        lineHeight: styleToApply.lineHeight,
        letterSpacing: styleToApply.letterSpacing,
      };
      
      // Add optional properties
      if (styleToApply.textAlign) styleProperties.textAlign = styleToApply.textAlign;
      if (styleToApply.textTransform) styleProperties.textTransform = styleToApply.textTransform;
      if (styleToApply.textDecoration) styleProperties.textDecoration = styleToApply.textDecoration;
      
      // Add custom properties
      if (styleToApply.customProperties) {
        Object.entries(styleToApply.customProperties).forEach(([key, value]) => {
          styleProperties[key] = value;
        });
      }
      
      // Apply the style
      return applyStyle(styleProperties);
      
    } catch (error) {
      console.error("Error applying text style:", error);
      toast({
        title: "Error applying style",
        description: "Something went wrong while applying the predefined style",
        variant: "destructive"
      });
      return false;
    }
  }, [editor, applyStyle, toast]);

  return {
    selectedInfo,
    applyStyle,
    applyTextStyle,
  };
};
