
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";
import { TextStyle } from "@/lib/types";
import { FontPicker } from "@/components/rich-text/FontPicker";

interface StyleEditorProps {
  editStyle: TextStyle;
  onStyleChange: (style: TextStyle) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const StyleEditor = ({
  editStyle,
  onStyleChange,
  onSave,
  onCancel
}: StyleEditorProps) => {
  // Font weight options
  const fontWeights = [
    { value: '300', label: 'Light' },
    { value: '400', label: 'Regular' },
    { value: '500', label: 'Medium' },
    { value: '600', label: 'Semi Bold' },
    { value: '700', label: 'Bold' },
    { value: '800', label: 'Extra Bold' },
  ];
  
  // Selector options
  const selectors = [
    { value: 'h1', label: 'Heading 1 (h1)' },
    { value: 'h2', label: 'Heading 2 (h2)' },
    { value: 'h3', label: 'Heading 3 (h3)' },
    { value: 'h4', label: 'Heading 4 (h4)' },
    { value: 'h5', label: 'Heading 5 (h5)' },
    { value: 'h6', label: 'Heading 6 (h6)' },
    { value: 'p', label: 'Paragraph (p)' },
    { value: 'blockquote', label: 'Blockquote' },
    { value: '.caption', label: 'Caption' },
    { value: '.highlight', label: 'Highlight' },
    { value: '.custom-class', label: 'Custom Class' },
  ];

  const handleChange = (field: keyof TextStyle, value: string) => {
    onStyleChange({
      ...editStyle,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="style-name">Name</Label>
          <Input
            id="style-name"
            value={editStyle.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Style name"
          />
        </div>
        
        <div>
          <Label htmlFor="style-selector">Selector</Label>
          <Select
            value={editStyle.selector}
            onValueChange={(value) => handleChange('selector', value)}
          >
            <SelectTrigger id="style-selector">
              <SelectValue placeholder="Select a selector" />
            </SelectTrigger>
            <SelectContent>
              {selectors.map(selector => (
                <SelectItem key={selector.value} value={selector.value}>
                  {selector.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="style-font">Font Family</Label>
          <div className="mt-1">
            <FontPicker 
              value={editStyle.fontFamily} 
              onChange={(value) => handleChange('fontFamily', value)}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="style-size">Font Size</Label>
          <Input
            id="style-size"
            value={editStyle.fontSize}
            onChange={(e) => handleChange('fontSize', e.target.value)}
            placeholder="16px"
          />
        </div>
        
        <div>
          <Label htmlFor="style-weight">Font Weight</Label>
          <Select
            value={editStyle.fontWeight}
            onValueChange={(value) => handleChange('fontWeight', value)}
          >
            <SelectTrigger id="style-weight">
              <SelectValue placeholder="Select weight" />
            </SelectTrigger>
            <SelectContent>
              {fontWeights.map(weight => (
                <SelectItem key={weight.value} value={weight.value}>
                  {weight.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="style-color">Color</Label>
          <div className="flex gap-2 items-center mt-1">
            <input
              type="color"
              id="style-color"
              value={editStyle.color}
              onChange={(e) => handleChange('color', e.target.value)}
              className="w-10 h-10 p-0 border-0 rounded-md"
            />
            <Input
              value={editStyle.color}
              onChange={(e) => handleChange('color', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="style-line-height">Line Height</Label>
          <Input
            id="style-line-height"
            value={editStyle.lineHeight}
            onChange={(e) => handleChange('lineHeight', e.target.value)}
            placeholder="1.5"
          />
        </div>
        
        <div>
          <Label htmlFor="style-letter-spacing">Letter Spacing</Label>
          <Input
            id="style-letter-spacing"
            value={editStyle.letterSpacing}
            onChange={(e) => handleChange('letterSpacing', e.target.value)}
            placeholder="0"
          />
        </div>
        
        <div className="col-span-2">
          <Label htmlFor="style-description">Description (optional)</Label>
          <Input
            id="style-description"
            value={editStyle.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Brief description of this style"
          />
        </div>
      </div>
      
      <div className="p-3 bg-white border border-gray-200 rounded-md">
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
      
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Style
        </Button>
      </div>
    </div>
  );
};
