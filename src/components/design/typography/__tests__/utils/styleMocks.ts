
import { TextStyle, TypographyStyles } from "@/lib/types";
import { vi } from "vitest";

// Mock initial values for a text style
export const mockInitialValues: TextStyle = {
  id: 'test-id',
  name: 'Test Style',
  fontFamily: 'Arial',
  fontSize: '16px',
  fontWeight: '400',
  color: '#000000',
  lineHeight: '1.5',
  letterSpacing: '0px',
  selector: 'h1',
  textAlign: 'left',
};

// Mock external styles
export const mockExternalStyles: TypographyStyles = {
  fontFamily: 'Helvetica',
  fontSize: '14px',
  fontWeight: '300',
  color: '#111111',
  lineHeight: '1.4',
  letterSpacing: '1px',
  textAlign: 'right',
};

// Mock handlers
export const mockSubmit = vi.fn();
export const mockStyleChange = vi.fn();

// Setup mocks for parent style with inheritance
export const setupTextStyleStoreMock = () => {
  vi.mock('@/stores/textStyles', () => ({
    textStyleStore: {
      getStyleWithInheritance: vi.fn().mockImplementation((id) => 
        Promise.resolve({
          id,
          name: `Parent Style ${id}`,
          fontFamily: 'Georgia',
          fontSize: '18px',
          fontWeight: '500',
          color: '#333333',
          lineHeight: '1.6',
          letterSpacing: '0.5px',
          selector: 'h2',
          textAlign: 'center',
        })
      ),
    },
  }));
};

// Mock components used by StyleForm
export const setupComponentMocks = () => {
  vi.mock('../../StyleFormPreview', () => ({
    StyleFormPreview: (props) => {
      const { styles, parentStyle } = props;
      return {
        type: 'div',
        props: {
          'data-testid': 'style-form-preview',
          'data-styles': JSON.stringify(styles),
          'data-parent': parentStyle ? parentStyle.id : 'none',
          children: 'Style Preview'
        }
      };
    }
  }));

  vi.mock('../../StyleFormTabs', () => ({
    StyleFormTabs: (props) => {
      const { name, parentId, styles, onNameChange, onStyleChange, showFormFields } = props;
      return {
        type: 'div',
        props: {
          'data-testid': 'style-form-tabs',
          'data-name': name,
          'data-parent-id': parentId || 'none',
          'data-show-fields': String(showFormFields),
          children: [
            {
              type: 'button',
              props: {
                'data-testid': 'mock-name-change',
                onClick: () => onNameChange('Changed Name'),
                children: 'Change Name'
              }
            },
            {
              type: 'button',
              props: {
                'data-testid': 'mock-style-change',
                onClick: () => onStyleChange('fontSize', '20px'),
                children: 'Change Font Size'
              }
            }
          ]
        }
      };
    }
  }));

  vi.mock('../../StyleFormActions', () => ({
    StyleFormActions: (props) => {
      const { showActions, isUpdate, onCancel, onSubmit } = props;
      return {
        type: 'div',
        props: {
          'data-testid': 'style-form-actions',
          'data-show-actions': String(showActions),
          'data-is-update': String(isUpdate),
          children: [
            {
              type: 'button',
              props: {
                'data-testid': 'mock-cancel',
                onClick: onCancel,
                children: 'Cancel'
              }
            },
            {
              type: 'button',
              props: {
                'data-testid': 'mock-submit',
                onClick: (e) => onSubmit(e),
                children: 'Submit'
              }
            }
          ]
        }
      };
    }
  }));
};
