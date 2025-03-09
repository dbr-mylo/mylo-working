
import { useState, useCallback, useEffect } from "react";
import { Editor } from "@tiptap/react";

export interface SelectedTextInfo {
  elementType: string;
  hasSelection: boolean;
  selectedText: string;
  cursorPosition: { node: any, offset: number } | null;
  isEmpty: boolean;
}

export const useSelectionTracker = (editor: Editor | null) => {
  const [selectedInfo, setSelectedInfo] = useState<SelectedTextInfo>({
    elementType: "",
    hasSelection: false,
    selectedText: "",
    cursorPosition: null,
    isEmpty: true
  });

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

  return {
    selectedInfo
  };
};
