
import { Editor } from "@tiptap/react";
import { Heading1, Heading2, Heading3 } from "lucide-react";
import { ToolbarButton } from "../buttons/ToolbarButton";
import { ButtonGroup } from "../buttons/ButtonGroup";

export const HeadingButtons = ({ editor }: { editor: Editor }) => {
  const buttons = [
    {
      icon: <Heading1 className="h-3.5 w-3.5" />,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
      tooltip: 'Heading 1',
    },
    {
      icon: <Heading2 className="h-3.5 w-3.5" />,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
      tooltip: 'Heading 2',
    },
    {
      icon: <Heading3 className="h-3.5 w-3.5" />,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive('heading', { level: 3 }),
      tooltip: 'Heading 3',
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
