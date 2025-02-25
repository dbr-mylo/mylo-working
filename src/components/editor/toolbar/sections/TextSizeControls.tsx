
import { Editor } from "@tiptap/react";
import { FONT_SIZES, LINE_HEIGHTS } from "../../constants";
import { ButtonGroup } from "../buttons/ButtonGroup";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useState, useEffect } from "react";

export const TextSizeControls = ({ editor }: { editor: Editor }) => {
  const [customSize, setCustomSize] = useState("");

  useEffect(() => {
    const updateSize = () => {
      const marks = editor.getAttributes('textStyle');
      setCustomSize(marks.fontSize?.replace('px', '') || '');
    };

    editor.on('selectionUpdate', updateSize);
    editor.on('transaction', updateSize);

    return () => {
      editor.off('selectionUpdate', updateSize);
      editor.off('transaction', updateSize);
    };
  }, [editor]);

  const handleSizeChange = (size: string) => {
    const sizeValue = size ? `${size}px` : '';
    editor.chain().focus().setFontSize(sizeValue).run();
    setCustomSize(size);
  };

  const handleCustomSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCustomSize(value);
    if (value) {
      handleSizeChange(value);
    }
  };

  const adjustSize = (increment: boolean) => {
    const currentSize = parseInt(customSize) || 0;
    const newSize = increment ? currentSize + 1 : currentSize - 1;
    if (newSize > 0) {
      handleSizeChange(newSize.toString());
    }
  };

  return (
    <ButtonGroup>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className="h-[30px] w-[30px] p-0"
          onClick={() => adjustSize(false)}
          title="Decrease font size"
        >
          <Minus className="h-4 w-4" />
        </Button>

        <div className="flex items-center">
          <input
            type="text"
            value={customSize}
            onChange={handleCustomSizeChange}
            className="h-[30px] w-[50px] rounded-l-md border border-r-0 border-input bg-background px-2 text-sm"
            placeholder="Size"
          />
          <select
            className="h-[30px] rounded-r-md border border-l-0 border-input bg-background px-1 text-sm"
            value={customSize}
            onChange={(e) => handleSizeChange(e.target.value)}
          >
            <option value="">Size</option>
            {FONT_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="h-[30px] w-[30px] p-0"
          onClick={() => adjustSize(true)}
          title="Increase font size"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <select
        className="h-[30px] rounded-md px-1.5 text-sm leading-[22px] border border-input bg-background"
        onChange={(e) => {
          editor.chain().focus().setLineHeight(e.target.value).run();
        }}
      >
        <option value="">Line Height</option>
        {Object.entries(LINE_HEIGHTS).map(([name, value]) => (
          <option key={value} value={value}>
            {name}
          </option>
        ))}
      </select>
    </ButtonGroup>
  );
};
