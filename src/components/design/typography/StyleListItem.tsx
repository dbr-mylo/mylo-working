
import { Button } from "@/components/ui/button";
import { TextStyle } from "@/lib/types";
import { Check, Text } from "lucide-react";

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
      className="w-full justify-between text-left font-normal hover:bg-accent transition-colors py-3"
      onClick={() => onSelect(style.id)}
    >
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 flex items-center justify-center rounded-full bg-muted">
          <Text className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <div className="flex flex-col items-start">
          <span className="font-medium">{style.name}</span>
          <span className="text-xs text-muted-foreground">{style.selector || 'No selector'}</span>
        </div>
      </div>
      <Check className="h-4 w-4 opacity-0 group-hover:opacity-50" />
    </Button>
  );
};
