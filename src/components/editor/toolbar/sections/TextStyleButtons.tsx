
import { Editor } from "@tiptap/react";
import { SubscriptIcon, SuperscriptIcon, Highlighter, Palette } from "lucide-react";
import { ToolbarButton } from "../buttons/ToolbarButton";
import { ButtonGroup } from "../buttons/ButtonGroup";
import { Button } from "@/components/ui/button";

export const TextStyleButtons = ({ editor }: { editor: Editor }) => {
  const scriptButtons = [
    {
      icon: <SuperscriptIcon className="h-3.5 w-3.5" />,
      action: () => editor.chain().focus().toggleSuperscript().run(),
      isActive: editor.isActive('superscript'),
      tooltip: 'Superscript',
    },
    {
      icon: <SubscriptIcon className="h-3.5 w-3.5" />,
      action: () => editor.chain().focus().toggleSubscript().run(),
      isActive: editor.isActive('subscript'),
      tooltip: 'Subscript',
    },
  ];

  return (
    <ButtonGroup className="">
      {scriptButtons.map((button, index) => (
        <ToolbarButton key={index} {...button} />
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          const color = window.prompt('Enter highlight color (e.g., #ffeb3b):');
          if (color) {
            editor.chain().focus().setHighlight({ color }).run();
          }
        }}
        className={`h-[30px] px-1.5 text-sm leading-[22px] ${editor.isActive('highlight') ? 'bg-accent' : ''}`}
        title="Highlight"
      >
        <Highlighter className="h-3.5 w-3.5" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          const color = window.prompt('Enter text color (e.g., #ff0000):');
          if (color) {
            editor.chain().focus().setColor(color).run();
          }
        }}
        className={`h-[30px] px-1.5 text-sm leading-[22px] ${editor.isActive('textStyle') ? 'bg-accent' : ''}`}
        title="Text Color"
      >
        <Palette className="h-3.5 w-3.5" />
      </Button>
    </ButtonGroup>
  );
};
