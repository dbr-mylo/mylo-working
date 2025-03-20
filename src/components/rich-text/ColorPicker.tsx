
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Paintbrush } from "lucide-react";
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
  const buttonSize = isDesigner ? "xxs" : "xs";
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size={buttonSize} 
          className={`flex items-center gap-1 ${isDesigner ? 'h-7 px-2' : 'h-8 px-2.5'}`}
        >
          <div 
            className="w-3 h-3 rounded-full border border-gray-300" 
            style={{ backgroundColor: value }}
          />
          <Paintbrush className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2">
        <div className="grid grid-cols-4 gap-1">
          {COLORS.map((color) => (
            <button
              key={color}
              className={`w-11 h-11 rounded-md border-2 ${
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
