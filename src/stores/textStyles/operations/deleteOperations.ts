
import { getLocalTextStyles } from "../storage";

export const deleteTextStyle = async (id: string): Promise<void> => {
  try {
    const styles = getLocalTextStyles();
    
    // Check if the style is a system style - cannot delete system styles
    const styleToDelete = styles.find(s => s.id === id);
    if (styleToDelete?.isSystem) {
      throw new Error("Cannot delete a system style");
    }
    
    // Check if it's the default style
    if (styleToDelete?.isDefault) {
      throw new Error("Cannot delete the default style. Set another style as default first.");
    }
    
    // Check if any styles inherit from this one
    const childStyles = styles.filter(s => s.parentId === id);
    if (childStyles.length > 0) {
      throw new Error("Cannot delete a style that is used as a parent by other styles.");
    }
    
    const filteredStyles = styles.filter(s => s.id !== id);
    localStorage.setItem('text_styles', JSON.stringify(filteredStyles));
  } catch (error) {
    console.error('Error in deleteTextStyle:', error);
    throw error;
  }
};
