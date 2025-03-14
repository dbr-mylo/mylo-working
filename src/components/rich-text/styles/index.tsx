
import { BaseEditorStyles } from './BaseEditorStyles';
import { FontSizeStyles } from './typography/FontSizeStyles';
import { ColorPreservationStyles } from './formatting/ColorPreservationStyles';
import { ListAndIndentStyles } from './layout/ListAndIndentStyles';

/**
 * EditorStyles Component
 * 
 * Centralized component that imports and renders all editor-related styles
 * organized by category.
 */
export const EditorStyles = () => {
  return (
    <>
      <BaseEditorStyles />
      <FontSizeStyles />
      <ColorPreservationStyles />
      <ListAndIndentStyles />
    </>
  );
};
