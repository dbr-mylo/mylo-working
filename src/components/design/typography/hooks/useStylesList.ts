
import { useState, useEffect, useMemo } from "react";
import { TextStyle } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";
import { Editor } from "@tiptap/react";
import { useStyleApplication } from "@/hooks/useStyleApplication";
import { useDefaultStyle } from "./useDefaultStyle";
import { useStyleContextMenu } from "./useStyleContextMenu";
import { useStyleApplication as useStyleClick } from "./useStyleApplication";

export const useStylesList = (
  onEditStyle: (style: TextStyle) => void,
  editorInstance?: Editor | null
) => {
  const [userStyles, setUserStyles] = useState<TextStyle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const styleApplication = editorInstance 
    ? useStyleApplication(editorInstance) 
    : null;

  const { defaultTextStyle } = useDefaultStyle(editorInstance);
  
  const {
    contextMenu,
    handleContextMenu,
    handleCloseContextMenu,
    handleDelete,
    handleDuplicate
  } = useStyleContextMenu(userStyles, setUserStyles);

  const { handleStyleClick } = useStyleClick(editorInstance, onEditStyle);

  const styles = useMemo(() => {
    return [defaultTextStyle, ...userStyles];
  }, [defaultTextStyle, userStyles]);

  useEffect(() => {
    const loadTextStyles = async () => {
      try {
        const fetchedStyles = await textStyleStore.getTextStyles();
        setUserStyles(fetchedStyles);
      } catch (error) {
        console.error("Error loading text styles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTextStyles();
  }, []);

  return {
    isLoading,
    styles,
    contextMenu,
    handleStyleClick,
    handleContextMenu,
    handleCloseContextMenu,
    handleDelete,
    handleDuplicate
  };
};
