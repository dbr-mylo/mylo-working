
import { useCallback } from "react";
import { Editor } from "@tiptap/react";
import { useToast } from "@/hooks/use-toast";

export const useTextStyleApplicator = (
  editor: Editor | null,
  applyStyle: (styleProperties: Record<string, any>) => boolean
) => {
  const { toast } = useToast();

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

  return { applyTextStyle };
};
