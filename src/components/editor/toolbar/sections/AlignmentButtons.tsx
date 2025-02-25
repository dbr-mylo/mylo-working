
import { Editor } from "@tiptap/react";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";
import { ToolbarButton } from "../buttons/ToolbarButton";
import { ButtonGroup } from "../buttons/ButtonGroup";

export const AlignmentButtons = ({ editor }: { editor: Editor }) => {
  const buttons = [
    {
      icon: <AlignLeft className="h-3.5 w-3.5" />,
      action: () => editor.chain().focus().setTextAlign('left').run(),
      isActive: editor.isActive({ textAlign: 'left' }),
      tooltip: 'Align Left',
    },
    {
      icon: <AlignCenter className="h-3.5 w-3.5" />,
      action: () => editor.chain().focus().setTextAlign('center').run(),
      isActive: editor.isActive({ textAlign: 'center' }),
      tooltip: 'Align Center',
    },
    {
      icon: <AlignRight className="h-3.5 w-3.5" />,
      action: () => editor.chain().focus().setTextAlign('right').run(),
      isActive: editor.isActive({ textAlign: 'right' }),
      tooltip: 'Align Right',
    },
    {
      icon: <AlignJustify className="h-3.5 w-3.5" />,
      action: () => editor.chain().focus().setTextAlign('justify').run(),
      isActive: editor.isActive({ textAlign: 'justify' }),
      tooltip: 'Align Justify',
    },
  ];

  return (
    <ButtonGroup>
      {buttons.map((button, index) => (
        <ToolbarButton key={index} {...button} />
      ))}
    </ButtonGroup>
  );
};
