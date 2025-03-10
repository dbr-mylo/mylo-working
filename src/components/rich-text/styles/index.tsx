
import { BaseEditorStyles } from './BaseEditorStyles';
import { FontSizeStyles } from './FontSizeStyles';
import { ColorPreservationStyles } from './ColorPreservationStyles';
import { ListAndIndentStyles } from './ListAndIndentStyles';

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
