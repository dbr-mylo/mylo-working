
import { TextStyle } from "@/lib/types";
import { useTypographyStyles } from "./hooks/useTypographyStyles";
import { useTextStyleSelection } from "./hooks/useTextStyleSelection";
import { useStyleOperations } from "./hooks/useStyleOperations";

interface UseTypographyPanelProps {
  selectedElement: HTMLElement | null;
  onStyleChange: (styles: Record<string, string>) => void;
  onSaveStyle?: (style: Partial<TextStyle>) => void;
  onStylesChange?: (styles: string) => void;
}

export const useTypographyPanel = ({
  selectedElement,
  onStyleChange,
  onSaveStyle,
  onStylesChange
}: UseTypographyPanelProps) => {
  // Use the typography styles hook
  const { styles, handleStyleChange } = useTypographyStyles({
    selectedElement,
    onStyleChange
  });
  
  // Use the text style selection hook
  const {
    textStyles,
    selectedStyleId,
    styleName,
    setSelectedStyleId,
    setStyleName,
    setTextStyles
  } = useTextStyleSelection({
    onStyleChange,
    onStylesChange
  });
  
  // Use the style operations hook
  const { handleSaveStyle, handleDeleteStyle } = useStyleOperations({
    styles,
    styleName,
    textStyles,
    selectedStyleId,
    selectedElement,
    setTextStyles,
    setSelectedStyleId,
    onSaveStyle,
    onStylesChange
  });

  return {
    styles,
    textStyles,
    selectedStyleId,
    styleName,
    setSelectedStyleId,
    setStyleName,
    handleStyleChange,
    handleSaveStyle,
    handleDeleteStyle
  };
};
