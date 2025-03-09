
import { Editor } from "@tiptap/react";
import { useSelectionTracker, SelectedTextInfo } from "./useSelectionTracker";
import { useStyleApplicator } from "./useStyleApplicator";
import { useTextStyleApplicator } from "./useTextStyleApplicator";

// Re-export SelectedTextInfo interface for external use
export type { SelectedTextInfo };

export const useStyleSelection = (editor: Editor | null) => {
  // Track selection in the editor
  const { selectedInfo } = useSelectionTracker(editor);
  
  // Get style application functionality
  const { applyStyle } = useStyleApplicator(editor, selectedInfo);
  
  // Get text style application functionality
  const { applyTextStyle } = useTextStyleApplicator(editor, applyStyle);

  return {
    selectedInfo,
    applyStyle,
    applyTextStyle,
  };
};
