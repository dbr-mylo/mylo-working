
import { Editor } from "@tiptap/react";
import { Bold, Italic, Strikethrough, Underline as UnderlineIcon } from "lucide-react";
import { ToolbarButton } from "../buttons/ToolbarButton";
import { ButtonGroup } from "../buttons/ButtonGroup";

export const FormatButtons = ({ editor }: { editor: Editor }) => {
  const buttons = [
    {
      icon: <Bold className="h-3.5 w-3.5" />,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
      tooltip: 'Bold',
    },
    {
      icon: <Italic className="h-3.5 w-3.5" />,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
      tooltip: 'Italic',
    },
    {
      icon: <UnderlineIcon className="h-3.5 w-3.5" />,
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive('underline'),
      tooltip: 'Underline',
    },
    {
      icon: <Strikethrough className="h-3.5 w-3.5" />,
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive('strike'),
      tooltip: 'Strikethrough',
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
