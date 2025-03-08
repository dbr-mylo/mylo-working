
import { v4 as uuidv4 } from 'uuid';
import { TextStyle } from "@/lib/types";
import { saveLocalTextStyle } from "../storage";
import { DEFAULT_STYLE_ID_KEY } from "../constants";
import { SaveTextStyleInput } from "./types";
import { setDefaultStyle } from "./defaultOperations";

export const saveTextStyle = async (style: SaveTextStyleInput): Promise<TextStyle> => {
  try {
    const now = new Date().toISOString();
    const styleToSave: TextStyle = {
      id: style.id || uuidv4(),
      name: style.name,
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      color: style.color,
      lineHeight: style.lineHeight,
      letterSpacing: style.letterSpacing,
      selector: style.selector,
      description: style.description,
      parentId: style.parentId,
      isDefault: style.isDefault || false,
      isUsed: style.isUsed !== undefined ? style.isUsed : false, // Default to false if not specified
      textAlign: style.textAlign,
      textTransform: style.textTransform,
      textDecoration: style.textDecoration,
      marginTop: style.marginTop,
      marginBottom: style.marginBottom,
      customProperties: style.customProperties,
      updated_at: now,
      created_at: style.id ? undefined : now // Only set created_at for new styles
    };
    
    // If this style is being set as default, update all other styles
    if (styleToSave.isDefault) {
      await setDefaultStyle(styleToSave.id);
    }
    
    // Save locally for now
    saveLocalTextStyle(styleToSave);
    return styleToSave;
  } catch (error) {
    console.error('Error in saveTextStyle:', error);
    throw error;
  }
};
