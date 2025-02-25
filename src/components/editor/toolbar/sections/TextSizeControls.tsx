
import { Editor } from "@tiptap/react";
import { FONT_SIZES, LINE_HEIGHTS } from "../../constants";
import { ButtonGroup } from "../buttons/ButtonGroup";

export const TextSizeControls = ({ editor }: { editor: Editor }) => {
  return (
    <ButtonGroup>
      <select
        className="h-[30px] rounded-md px-1.5 text-sm leading-[22px] border border-input bg-background"
        onChange={(e) => {
          editor.chain().focus().setFontSize(e.target.value).run();
        }}
      >
        <option value="">Font Size</option>
        {FONT_SIZES.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>

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
