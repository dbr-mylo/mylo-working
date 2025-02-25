
import { Editor } from "@tiptap/react";
import { List, ListOrdered } from "lucide-react";
import { ToolbarButton } from "../buttons/ToolbarButton";
import { ButtonGroup } from "../buttons/ButtonGroup";

export const ListButtons = ({ editor }: { editor: Editor }) => {
  const buttons = [
    {
      icon: <List className="h-3.5 w-3.5" />,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
      tooltip: 'Bullet List',
    },
    {
      icon: <ListOrdered className="h-3.5 w-3.5" />,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
      tooltip: 'Numbered List',
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
