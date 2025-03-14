
import React from "react";
import { TextStyle } from "@/lib/types";
import { EmptyState } from "./EmptyState";
import { StyleSelector } from "./StyleSelector";
import { StyleForm } from "./StyleForm";
import { useTypographyPanel } from "./useTypographyPanel";

interface TypographyPanelProps {
  selectedElement: HTMLElement | null;
  onStyleChange: (styles: Record<string, string>) => void;
  onSaveStyle?: (style: Partial<TextStyle>) => void;
  onStylesChange?: (styles: string) => void;
}

export const TypographyPanel = ({ 
  selectedElement, 
  onStyleChange,
  onSaveStyle,
  onStylesChange
}: TypographyPanelProps) => {
  const {
    styles,
    textStyles,
    selectedStyleId,
    styleName,
    setSelectedStyleId,
    setStyleName,
    handleStyleChange,
    handleSaveStyle,
    handleDeleteStyle
  } = useTypographyPanel({
    selectedElement,
    onStyleChange,
    onSaveStyle,
    onStylesChange
  });

  return (
    <div className="p-4 bg-white rounded-md shadow-sm border border-gray-200 space-y-4">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Typography Properties</h3>
        </div>

        {/* Text Style Selection */}
        <StyleSelector
          textStyles={textStyles}
          selectedStyleId={selectedStyleId}
          styleName={styleName}
          setSelectedStyleId={setSelectedStyleId}
          setStyleName={setStyleName}
          handleSaveStyle={handleSaveStyle}
          handleDeleteStyle={handleDeleteStyle}
        />

        {selectedElement ? (
          <StyleForm 
            styles={styles} 
            handleStyleChange={handleStyleChange}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};
