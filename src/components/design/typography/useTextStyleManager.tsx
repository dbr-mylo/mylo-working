import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { TextStyle } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";

export const useTextStyleManager = (onStylesChange: (styles: string) => void) => {
  const { toast } = useToast();
  const [textStyles, setTextStyles] = useState<TextStyle[]>([]);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Default empty style for initialization
  const defaultEmptyStyle: TextStyle = {
    id: '',
    name: '',
    fontFamily: 'Inter',
    fontSize: '16px',
    fontWeight: '400',
    color: '#000000',
    lineHeight: '1.5',
    letterSpacing: '0',
    selector: 'p',
    description: '',
    updated_at: new Date().toISOString() // Add the required updated_at property
  };
  
  // Current style being edited
  const [editStyle, setEditStyle] = useState<TextStyle>(defaultEmptyStyle);
  
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
  }, [onStylesChange, selectedStyleId]);
  
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
      description: '',
      updated_at: new Date().toISOString() // Add the required updated_at property
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

  return {
    textStyles,
    selectedStyleId,
    setSelectedStyleId,
    editStyle,
    setEditStyle,
    isEditing,
    setIsEditing,
    handleSaveStyle,
    handleDeleteStyle,
    handleNewStyle,
    handleEditStyle,
    handleCancelEdit
  };
};
