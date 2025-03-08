
import { v4 as uuidv4 } from 'uuid';
import { TextStyle } from "@/lib/types";
import { getLocalTextStyles, saveLocalTextStyle } from "../storage";

export const duplicateTextStyle = async (id: string): Promise<TextStyle> => {
  try {
    const styles = getLocalTextStyles();
    const styleToDuplicate = styles.find(s => s.id === id);
    
    if (!styleToDuplicate) {
      throw new Error("Style not found");
    }
    
    // Create a new style based on the existing one
    const newStyle: TextStyle = {
      ...styleToDuplicate,
      id: uuidv4(),
      name: `${styleToDuplicate.name} (Copy)`,
      isDefault: false, // A copy is never the default
      isSystem: false,  // A copy is never a system style
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Save the duplicated style
    saveLocalTextStyle(newStyle);
    return newStyle;
  } catch (error) {
    console.error('Error in duplicateTextStyle:', error);
    throw error;
  }
};
