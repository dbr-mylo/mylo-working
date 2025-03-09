
import React from "react";
import { Editor } from "@tiptap/react";
import { EditorToolbar } from "@/components/rich-text/EditorToolbar";
import { EditorStyleControls } from "@/components/design/EditorStyleControls";
import { PreviewToggle } from "@/components/design/PreviewToggle";

interface DesignerToolbarProps {
  editor: Editor | null;
  currentFont: string;
  currentColor: string;
  onFontChange: (font: string) => void;
  onColorChange: (color: string) => void;
  isPreviewVisible: boolean;
  onTogglePreview: () => void;
}

export const DesignerToolbar = ({
  editor,
  currentFont,
  currentColor,
  onFontChange,
  onColorChange,
  isPreviewVisible,
  onTogglePreview
}: DesignerToolbarProps) => {
  return (
    <div className="w-full">
      <div className="bg-white border-b border-slate-200 z-10">
        <div className="flex items-center justify-between px-4">
          {editor && (
            <div className="flex-1 py-2">
              <EditorToolbar
                editor={editor}
                currentFont={currentFont}
                currentColor={currentColor}
                onFontChange={onFontChange}
                onColorChange={onColorChange}
              />
            </div>
          )}
          <div className="flex items-center h-full">
            <PreviewToggle 
              isPreviewVisible={isPreviewVisible} 
              onTogglePreview={onTogglePreview} 
            />
          </div>
        </div>
        
        {editor && (
          <div className="px-4 pb-2 flex">
            <EditorStyleControls editor={editor} />
          </div>
        )}
      </div>
    </div>
  );
};
