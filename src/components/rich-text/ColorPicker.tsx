
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Palette } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const COLORS = [
  "#000000", // Black
  "#FF0000", // Red
  "#00FF00", // Green
  "#0000FF", // Blue
  "#FFFF00", // Yellow
  "#FF00FF", // Magenta
  "#00FFFF", // Cyan
  "#FFA500", // Orange
  "#800080", // Purple
  "#008000", // Dark Green
  "#800000", // Maroon
  "#008080", // Teal
  "#000080", // Navy
  "#808080", // Gray
  "#F08080", // Light Coral
  "#4B0082", // Indigo
];

export const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  const { role } = useAuth();
  const isDesigner = role === "designer";
  const buttonSize = isDesigner ? "xxs" : "sm";
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size={buttonSize} 
          className="flex items-center gap-2 w-[90px]"
        >
          <div 
            className="w-4 h-4 rounded-sm border border-gray-300" 
            style={{ backgroundColor: value }}
          />
          <Palette className="h-4 w-4" />
          <span className="sr-only">Color</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <div className="grid grid-cols-4 gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              className={`w-12 h-12 rounded-md border-2 ${
                color === value ? "border-black" : "border-transparent"
              }`}
              style={{ backgroundColor: color }}
              onClick={() => onChange(color)}
              aria-label={color}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
