
import { Button } from "@/components/ui/button";
import { TextStyle } from "@/lib/types";
import { Check } from "lucide-react";

interface StyleListItemProps {
  style: TextStyle;
  onSelect: (styleId: string) => void;
}

export const StyleListItem = ({ style, onSelect }: StyleListItemProps) => {
  return (
    <Button
      key={style.id}
      variant="ghost"
      size="sm"
      className="w-full justify-between text-left font-normal"
      onClick={() => onSelect(style.id)}
    >
      <div className="flex flex-col items-start">
        <span>{style.name}</span>
        <span className="text-xs text-muted-foreground">{style.selector || 'No selector'}</span>
      </div>
      <Check className="h-4 w-4 opacity-0 group-hover:opacity-50" />
    </Button>
  );
};
