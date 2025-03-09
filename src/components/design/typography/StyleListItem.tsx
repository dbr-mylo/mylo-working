
import { Button } from "@/components/ui/button";
import { TextStyle } from "@/lib/types";
import { Check, Text } from "lucide-react";

interface StyleListItemProps {
  style: TextStyle;
  onSelect: (style: TextStyle) => void;  // Updated to pass the entire style object
}

export const StyleListItem = ({ style, onSelect }: StyleListItemProps) => {
  const handleClick = () => {
    onSelect(style);  // Pass the entire style object, not just the ID
  };

  return (
    <Button
      key={style.id}
      variant="ghost"
      size="xs"
      className="w-full justify-between text-left font-normal hover:bg-accent transition-colors py-2"
      onClick={handleClick}
    >
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 flex items-center justify-center rounded-full bg-muted">
          <Text className="h-3 w-3 text-muted-foreground" />
        </div>
        <span className="font-medium">{style.name}</span>
      </div>
      <Check className="h-3.5 w-3.5 opacity-0 group-hover:opacity-50" />
    </Button>
  );
};
