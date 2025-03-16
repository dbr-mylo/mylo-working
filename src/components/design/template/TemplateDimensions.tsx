
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TemplateDimensionsProps {
  width: string;
  height: string;
  onWidthChange: (width: string) => void;
  onHeightChange: (height: string) => void;
  onApplyDimensions: () => void;
}

export const TemplateDimensions = ({
  width,
  height,
  onWidthChange,
  onHeightChange,
  onApplyDimensions
}: TemplateDimensionsProps) => {
  return (
    <div className="flex gap-2 items-center">
      <div className="flex-1">
        <label className="text-xs text-gray-600 block mb-1">Width</label>
        <Input 
          value={width}
          onChange={(e) => onWidthChange(e.target.value)}
          placeholder="8.5in"
        />
      </div>
      <div className="flex-1">
        <label className="text-xs text-gray-600 block mb-1">Height</label>
        <Input 
          value={height}
          onChange={(e) => onHeightChange(e.target.value)}
          placeholder="11in"
        />
      </div>
      <div className="pt-5">
        <Button size="sm" onClick={onApplyDimensions}>
          Apply
        </Button>
      </div>
    </div>
  );
};
