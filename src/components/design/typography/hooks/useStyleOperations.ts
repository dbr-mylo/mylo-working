
import { useToast } from "@/hooks/use-toast";
import { textStyleStore } from "@/stores/textStyles";
import { TextStyle, TypographyStyles } from "@/lib/types";

interface UseStyleOperationsProps {
  styles: TypographyStyles;
  styleName: string;
  textStyles: TextStyle[];
  selectedStyleId: string | null;
  selectedElement: HTMLElement | null;
  setTextStyles: (styles: TextStyle[]) => void;
  setSelectedStyleId: (id: string | null) => void;
  onSaveStyle?: (style: Partial<TextStyle>) => void;
  onStylesChange?: (styles: string) => void;
}

export const useStyleOperations = ({
  styles,
  styleName,
  textStyles,
  selectedStyleId,
  selectedElement,
  setTextStyles,
  setSelectedStyleId,
  onSaveStyle,
  onStylesChange
}: UseStyleOperationsProps) => {
  const { toast } = useToast();

  const handleSaveStyle = async () => {
    if (!styleName.trim()) {
      toast({
        title: "Name required",
        description: "Please provide a name for this style",
        variant: "destructive"
      });
      return;
    }

    try {
      const selector = selectedElement?.tagName.toLowerCase() || "p";
      const styleData = {
        name: styleName,
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        color: styles.color,
        lineHeight: styles.lineHeight,
        letterSpacing: styles.letterSpacing,
        selector
      };
      
      // Call the onSaveStyle prop if provided
      if (onSaveStyle) {
        onSaveStyle(styleData);
      }
      
      // Save to textStyleStore directly
      const savedStyle = await textStyleStore.saveTextStyle(styleData);
      
      // Update the local text styles
      setTextStyles(prev => {
        const index = prev.findIndex(s => s.id === savedStyle.id);
        if (index >= 0) {
          const newStyles = [...prev];
          newStyles[index] = savedStyle;
          return newStyles;
        } else {
          return [...prev, savedStyle];
        }
      });
      
      // Update selected style ID
      setSelectedStyleId(savedStyle.id);
      
      // Generate CSS and update parent component if provided
      if (onStylesChange) {
        const allStyles = await textStyleStore.getTextStyles();
        const css = textStyleStore.generateCSSFromTextStyles(allStyles);
        onStylesChange(css);
      }
      
      toast({
        title: "Style saved",
        description: "Text style has been saved successfully"
      });
    } catch (error) {
      console.error("Error saving style:", error);
      toast({
        title: "Error saving style",
        description: "There was a problem saving your text style",
        variant: "destructive"
      });
    }
  };

  const handleDeleteStyle = async (id: string) => {
    try {
      await textStyleStore.deleteTextStyle(id);
      
      // Update local state
      const updatedStyles = textStyles.filter(s => s.id !== id);
      setTextStyles(updatedStyles);
      
      // Clear selected style if it was deleted
      if (selectedStyleId === id) {
        setSelectedStyleId(null);
      }
      
      // Generate CSS and update parent component if provided
      if (onStylesChange) {
        const css = textStyleStore.generateCSSFromTextStyles(updatedStyles);
        onStylesChange(css);
      }
      
      toast({
        title: "Style deleted",
        description: "Text style has been deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting style:", error);
      toast({
        title: "Error deleting style",
        description: "There was a problem deleting the text style",
        variant: "destructive"
      });
    }
  };

  return {
    handleSaveStyle,
    handleDeleteStyle
  };
};
