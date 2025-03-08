
import { useElementSelection } from "./hooks/useElementSelection";
import { useStyleApplicator } from "./hooks/useStyleApplicator";

export const useDocumentPreview = (
  onElementSelect?: (element: HTMLElement | null) => void
) => {
  const {
    previewRef,
    selectedElement,
    handlePreviewClick
  } = useElementSelection(onElementSelect);
  
  const { handleApplyStyle } = useStyleApplicator();

  // Create a wrapper for handleApplyStyle that includes the selectedElement
  const applyStyleToSelectedElement = async (styleId: string) => {
    await handleApplyStyle(selectedElement, styleId);
  };

  return {
    previewRef,
    selectedElement,
    handlePreviewClick,
    handleApplyStyle: applyStyleToSelectedElement
  };
};
