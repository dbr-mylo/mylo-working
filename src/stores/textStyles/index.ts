
import { useTextStyleStore } from './textStyleState';
import { useTextStyles, useTextStyleOperations, useTextStyleCSS } from './useTextStyles';
import * as textStyleUtils from './textStyleUtils';

// Re-export everything for backward compatibility
export { 
  useTextStyleStore,
  useTextStyles,
  useTextStyleOperations,
  useTextStyleCSS,
  textStyleUtils
};

// Export a singleton instance for backward compatibility
class TextStyleStore {
  async getTextStyles() {
    return useTextStyleStore.getState().getTextStyles();
  }

  async getStyleWithInheritance(styleId: string) {
    return useTextStyleStore.getState().getStyleWithInheritance(styleId);
  }

  async convertAllStylesToUnit(unit: any) {
    return useTextStyleStore.getState().convertAllStylesToUnit(unit);
  }

  async saveTextStyle(style: any) {
    return useTextStyleStore.getState().saveTextStyle(style);
  }

  async deleteTextStyle(id: string) {
    return useTextStyleStore.getState().deleteTextStyle(id);
  }

  async duplicateTextStyle(id: string) {
    return useTextStyleStore.getState().duplicateTextStyle(id);
  }

  async setDefaultStyle(id: string) {
    return useTextStyleStore.getState().setDefaultStyle(id);
  }

  generateCSSFromTextStyles(styles: any[], currentUnit?: any) {
    return useTextStyleStore.getState().generateCSSFromTextStyles(styles, currentUnit);
  }
}

export const textStyleStore = new TextStyleStore();
