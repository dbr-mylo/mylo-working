
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PlusCircle, Edit2, Trash2 } from "lucide-react";
import { TextStyle } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VisualStyleBrowser } from "./VisualStyleBrowser";

interface StyleBrowserProps {
  textStyles: TextStyle[];
  selectedStyleId: string | null;
  onSelectStyle: (id: string) => void;
  onNewStyle: () => void;
  onEditStyle: () => void;
  onDeleteStyle: (id: string) => void;
  editStyle: TextStyle;
  isEditing: boolean;
}

export const StyleBrowser = ({
  textStyles,
  selectedStyleId,
  onSelectStyle,
  onNewStyle,
  onEditStyle,
  onDeleteStyle,
  editStyle,
  isEditing
}: StyleBrowserProps) => {
  // Font weight options for display
  const fontWeights = [
    { value: '300', label: 'Light' },
    { value: '400', label: 'Regular' },
    { value: '500', label: 'Medium' },
    { value: '600', label: 'Semi Bold' },
    { value: '700', label: 'Bold' },
    { value: '800', label: 'Extra Bold' },
  ];

  const [viewMode, setViewMode] = useState<"classic" | "visual">("visual");

  const handleApplyStyle = (styleId: string) => {
    onSelectStyle(styleId);
  };

  const handleEditStyle = (style: TextStyle) => {
    onSelectStyle(style.id);
    onEditStyle();
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="visual" onValueChange={(value) => setViewMode(value as "classic" | "visual")}>
        <TabsList className="w-full mb-4">
          <TabsTrigger value="visual" disabled={isEditing}>Visual Browser</TabsTrigger>
          <TabsTrigger value="classic" disabled={isEditing}>Classic View</TabsTrigger>
        </TabsList>

        <TabsContent value="visual">
          <VisualStyleBrowser
            textStyles={textStyles}
            selectedStyleId={selectedStyleId}
            onSelectStyle={(style) => onSelectStyle(style.id)}
            onNewStyle={onNewStyle}
            onEditStyle={handleEditStyle}
            onApplyStyle={handleApplyStyle}
          />
        </TabsContent>

        <TabsContent value="classic">
          <div className="flex justify-between items-center">
            <Select
              value={selectedStyleId || ''}
              onValueChange={onSelectStyle}
              disabled={isEditing}
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
            
            <div className="flex gap-2 ml-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onNewStyle}
                disabled={isEditing}
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                New
              </Button>
              
              {selectedStyleId && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onEditStyle}
                    disabled={isEditing}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onDeleteStyle(selectedStyleId)}
                    disabled={isEditing}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {selectedStyleId && !isEditing && (
            <div className="mt-4 p-4 border border-gray-200 rounded-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">Name</Label>
                  <p className="text-sm font-medium">{editStyle.name}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Selector</Label>
                  <p className="text-sm font-mono">{editStyle.selector}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Font</Label>
                  <p className="text-sm" style={{ fontFamily: editStyle.fontFamily }}>
                    {editStyle.fontFamily}, {editStyle.fontSize}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Weight</Label>
                  <p className="text-sm" style={{ fontWeight: editStyle.fontWeight }}>
                    {
                      fontWeights.find(fw => fw.value === editStyle.fontWeight)?.label || 
                      editStyle.fontWeight
                    }
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Color</Label>
                  <div className="flex items-center mt-1">
                    <div 
                      className="w-4 h-4 rounded-full mr-2 border border-gray-300" 
                      style={{ backgroundColor: editStyle.color }}
                    />
                    <p className="text-sm font-mono">{editStyle.color}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Line Height / Letter Spacing</Label>
                  <p className="text-sm">
                    {editStyle.lineHeight} / {editStyle.letterSpacing}
                  </p>
                </div>
              </div>
              
              {editStyle.description && (
                <div className="mt-4">
                  <Label className="text-xs text-gray-500">Description</Label>
                  <p className="text-sm">{editStyle.description}</p>
                </div>
              )}
              
              <div className="mt-4 p-3 bg-white border border-gray-200 rounded-md">
                <Label className="text-xs text-gray-500 mb-2 block">Preview</Label>
                <div style={{ 
                  fontFamily: editStyle.fontFamily,
                  fontSize: editStyle.fontSize,
                  fontWeight: editStyle.fontWeight,
                  color: editStyle.color,
                  lineHeight: editStyle.lineHeight,
                  letterSpacing: editStyle.letterSpacing
                }}>
                  The quick brown fox jumps over the lazy dog
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
