
import React from "react";
import { Button } from "@/components/ui/button";
import { TextStyle } from "@/lib/types";
import { Save, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StyleSelectorProps {
  textStyles: TextStyle[];
  selectedStyleId: string | null;
  styleName: string;
  setSelectedStyleId: (id: string) => void;
  setStyleName: (name: string) => void;
  handleSaveStyle: () => void;
  handleDeleteStyle: (id: string) => void;
}

export const StyleSelector = ({
  textStyles,
  selectedStyleId,
  styleName,
  setSelectedStyleId,
  setStyleName,
  handleSaveStyle,
  handleDeleteStyle
}: StyleSelectorProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium">Text Styles</label>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveStyle}
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
          onValueChange={setSelectedStyleId}
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
            onClick={() => selectedStyleId && handleDeleteStyle(selectedStyleId)}
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
          onChange={(e) => setStyleName(e.target.value)}
          placeholder="Style name"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    </div>
  );
};
