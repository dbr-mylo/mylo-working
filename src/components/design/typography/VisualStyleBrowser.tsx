
import React, { useState } from "react";
import { TextStyle } from "@/lib/types";
import { VisualStyleCard } from "./VisualStyleCard";
import { Button } from "@/components/ui/button";
import { EmptyState } from "./EmptyState";
import { PlusCircle, List, Grid, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface VisualStyleBrowserProps {
  textStyles: TextStyle[];
  onSelectStyle: (style: TextStyle) => void;
  onNewStyle: () => void;
  onEditStyle: (style: TextStyle) => void;
  onApplyStyle: (styleId: string) => void;
  selectedStyleId: string | null;
}

export const VisualStyleBrowser = ({
  textStyles,
  onSelectStyle,
  onNewStyle,
  onEditStyle,
  onApplyStyle,
  selectedStyleId
}: VisualStyleBrowserProps) => {
  const [filter, setFilter] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const filteredStyles = textStyles.filter(style => 
    style.name.toLowerCase().includes(filter.toLowerCase())
  );
  
  if (textStyles.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Text Styles</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onNewStyle}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            New Style
          </Button>
        </div>
        
        <EmptyState />
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Text Styles</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onNewStyle}
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          New Style
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter styles..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="flex border rounded overflow-hidden">
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            className="h-9 rounded-none"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            className="h-9 rounded-none"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className={viewMode === "grid" 
        ? "grid grid-cols-2 md:grid-cols-3 gap-3" 
        : "flex flex-col space-y-2"
      }>
        {filteredStyles.length > 0 ? (
          filteredStyles.map(style => (
            <VisualStyleCard
              key={style.id}
              style={style}
              onEdit={() => onEditStyle(style)}
              onApply={onApplyStyle}
              isDefault={style.isDefault}
              isUsed={style.isUsed}
              isInherited={!!style.parentId}
              hasChildren={style.hasChildren}
              isSelected={selectedStyleId === style.id}
            />
          ))
        ) : (
          <div className="col-span-full py-6 text-center text-sm text-muted-foreground">
            No styles match your filter
          </div>
        )}
      </div>
    </div>
  );
};
