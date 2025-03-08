
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Edit2, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TextStyle } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles"; // Updated import path
import { FontPicker } from "@/components/rich-text/FontPicker";

interface TextStyleManagerProps {
  onStylesChange: (styles: string) => void;
}

export const TextStyleManager = ({ onStylesChange }: TextStyleManagerProps) => {
  const { toast } = useToast();
  const [textStyles, setTextStyles] = useState<TextStyle[]>([]);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Current style being edited
  const [editStyle, setEditStyle] = useState<TextStyle>({
    id: '',
    name: '',
    fontFamily: 'Inter',
    fontSize: '16px',
    fontWeight: '400',
    color: '#000000',
    lineHeight: '1.5',
    letterSpacing: '0',
    selector: 'p',
    description: ''
  });
  
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
  
  // Load text styles when component mounts
  useEffect(() => {
    const loadTextStyles = async () => {
      const styles = await textStyleStore.getTextStyles();
      setTextStyles(styles);
      
      // Generate CSS and update parent component
      const css = textStyleStore.generateCSSFromTextStyles(styles);
      onStylesChange(css);
      
      // Set a default selected style if there are styles and none is selected
      if (styles.length > 0 && !selectedStyleId) {
        setSelectedStyleId(styles[0].id);
      }
    };
    
    loadTextStyles();
  }, [onStylesChange]);
  
  // When selected style changes, update the edit form
  useEffect(() => {
    if (selectedStyleId) {
      const style = textStyles.find(s => s.id === selectedStyleId);
      if (style) {
        setEditStyle(style);
      }
    }
  }, [selectedStyleId, textStyles]);
  
  const handleSaveStyle = async () => {
    try {
      // Validate required fields
      if (!editStyle.name || !editStyle.selector) {
        toast({
          title: "Required fields missing",
          description: "Name and selector are required fields.",
          variant: "destructive",
        });
        return;
      }
      
      // Save the style
      const savedStyle = await textStyleStore.saveTextStyle(editStyle);
      
      // Update the local styles
      setTextStyles(prev => {
        const index = prev.findIndex(s => s.id === savedStyle.id);
        if (index >= 0) {
          // Update existing
          const newStyles = [...prev];
          newStyles[index] = savedStyle;
          return newStyles;
        } else {
          // Add new
          return [...prev, savedStyle];
        }
      });
      
      // Exit edit mode
      setIsEditing(false);
      setSelectedStyleId(savedStyle.id);
      
      // Generate CSS and update parent component
      const updatedStyles = await textStyleStore.getTextStyles();
      const css = textStyleStore.generateCSSFromTextStyles(updatedStyles);
      onStylesChange(css);
      
      toast({
        title: "Style saved",
        description: "Text style has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving text style:", error);
      toast({
        title: "Error saving style",
        description: "There was a problem saving your text style.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteStyle = async (id: string) => {
    try {
      await textStyleStore.deleteTextStyle(id);
      
      // Update local state
      const updatedStyles = textStyles.filter(s => s.id !== id);
      setTextStyles(updatedStyles);
      
      // Update selected style if deleted
      if (selectedStyleId === id) {
        setSelectedStyleId(updatedStyles.length > 0 ? updatedStyles[0].id : null);
      }
      
      // Generate CSS and update parent component
      const css = textStyleStore.generateCSSFromTextStyles(updatedStyles);
      onStylesChange(css);
      
      toast({
        title: "Style deleted",
        description: "Text style has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting text style:", error);
      toast({
        title: "Error deleting style",
        description: "There was a problem deleting your text style.",
        variant: "destructive",
      });
    }
  };
  
  const handleNewStyle = () => {
    setEditStyle({
      id: '',
      name: 'New Style',
      fontFamily: 'Inter',
      fontSize: '16px',
      fontWeight: '400',
      color: '#000000',
      lineHeight: '1.5',
      letterSpacing: '0',
      selector: 'p',
      description: ''
    });
    setIsEditing(true);
    setSelectedStyleId(null);
  };
  
  const handleEditStyle = () => {
    setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    if (selectedStyleId) {
      const style = textStyles.find(s => s.id === selectedStyleId);
      if (style) {
        setEditStyle(style);
      }
    }
  };
  
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
      <h3 className="text-sm font-medium mb-3">Text Styles</h3>
      
      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="browse">Browse Styles</TabsTrigger>
          {isEditing && <TabsTrigger value="edit">Edit Style</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="browse" className="space-y-4">
          <div className="flex justify-between items-center">
            <Select
              value={selectedStyleId || ''}
              onValueChange={setSelectedStyleId}
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
                onClick={handleNewStyle}
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
                    onClick={handleEditStyle}
                    disabled={isEditing}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteStyle(selectedStyleId)}
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
        
        <TabsContent value="edit" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="style-name">Name</Label>
              <Input
                id="style-name"
                value={editStyle.name}
                onChange={(e) => setEditStyle({...editStyle, name: e.target.value})}
                placeholder="Style name"
              />
            </div>
            
            <div>
              <Label htmlFor="style-selector">Selector</Label>
              <Select
                value={editStyle.selector}
                onValueChange={(value) => setEditStyle({...editStyle, selector: value})}
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
                  onChange={(value) => setEditStyle({...editStyle, fontFamily: value})}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="style-size">Font Size</Label>
              <Input
                id="style-size"
                value={editStyle.fontSize}
                onChange={(e) => setEditStyle({...editStyle, fontSize: e.target.value})}
                placeholder="16px"
              />
            </div>
            
            <div>
              <Label htmlFor="style-weight">Font Weight</Label>
              <Select
                value={editStyle.fontWeight}
                onValueChange={(value) => setEditStyle({...editStyle, fontWeight: value})}
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
                  onChange={(e) => setEditStyle({...editStyle, color: e.target.value})}
                  className="w-10 h-10 p-0 border-0 rounded-md"
                />
                <Input
                  value={editStyle.color}
                  onChange={(e) => setEditStyle({...editStyle, color: e.target.value})}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="style-line-height">Line Height</Label>
              <Input
                id="style-line-height"
                value={editStyle.lineHeight}
                onChange={(e) => setEditStyle({...editStyle, lineHeight: e.target.value})}
                placeholder="1.5"
              />
            </div>
            
            <div>
              <Label htmlFor="style-letter-spacing">Letter Spacing</Label>
              <Input
                id="style-letter-spacing"
                value={editStyle.letterSpacing}
                onChange={(e) => setEditStyle({...editStyle, letterSpacing: e.target.value})}
                placeholder="0"
              />
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="style-description">Description (optional)</Label>
              <Input
                id="style-description"
                value={editStyle.description || ''}
                onChange={(e) => setEditStyle({...editStyle, description: e.target.value})}
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
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveStyle}>
              <Save className="h-4 w-4 mr-2" />
              Save Style
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

