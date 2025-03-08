
import { TextStyle } from "@/lib/types";

export const TEXT_STYLE_STORAGE_KEY = 'text_styles';
export const DEFAULT_STYLE_ID_KEY = 'default_text_style_id';

// Default text styles that will be available
export const DEFAULT_TEXT_STYLES: TextStyle[] = [
  {
    id: 'heading-1',
    name: 'Heading 1',
    fontFamily: 'Playfair Display',
    fontSize: '32px',
    fontWeight: '700',
    color: '#1A1F2C',
    lineHeight: '1.2',
    letterSpacing: '0',
    selector: 'h1',
    description: 'Main heading style',
    isSystem: true,
    isDefault: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'heading-2',
    name: 'Heading 2',
    fontFamily: 'Playfair Display',
    fontSize: '24px',
    fontWeight: '700',
    color: '#1A1F2C',
    lineHeight: '1.3',
    letterSpacing: '0',
    selector: 'h2',
    description: 'Secondary heading style',
    isSystem: true,
    isDefault: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'body',
    name: 'Body Text',
    fontFamily: 'Inter',
    fontSize: '16px',
    fontWeight: '400',
    color: '#333333',
    lineHeight: '1.5',
    letterSpacing: '0',
    selector: 'p',
    description: 'Default paragraph style',
    isSystem: true,
    isDefault: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'caption',
    name: 'Caption',
    fontFamily: 'Inter',
    fontSize: '14px',
    fontWeight: '400',
    color: '#666666',
    lineHeight: '1.4',
    letterSpacing: '0.5px',
    selector: '.caption',
    description: 'Caption text style',
    isSystem: true,
    isDefault: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
