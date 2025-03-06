
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TextStyle } from "@/lib/types";
import { Trash2, Save } from "lucide-react";

interface StyleSelectionProps {
  textStyles: TextStyle[];
  selectedStyleId: string | null;
  styleName: string;
  onStyleNameChange: (name: string) => void;
  onStyleSelect: (id: string) => void;
  onSaveStyle: () => void;
  onDeleteStyle: (id: string) => void;
}

export const StyleSelection = ({
  textStyles,
  selectedStyleId,
  styleName,
  onStyleNameChange,
  onStyleSelect,
  onSaveStyle,
  onDeleteStyle
}: StyleSelectionProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium">Text Styles</label>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveStyle}
            className="h-8"
          >
            <Save className="h-3.5 w-3.5 mr-1" />
            Save
          </Button>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Select
          value={selectedStyleId || ""}
          onValueChange={onStyleSelect}
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select a text style" />
          </SelectTrigger>
          <SelectContent>
            {textStyles.map(style => (
              <SelectItem key={style.id} value={style.id}>
                <span style={{ fontFamily: style.fontFamily }}>
                  {style.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {selectedStyleId && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => selectedStyleId && onDeleteStyle(selectedStyleId)}
            className="h-10 w-10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={styleName}
          onChange={(e) => onStyleNameChange(e.target.value)}
          placeholder="Style name"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    </div>
  );
};
