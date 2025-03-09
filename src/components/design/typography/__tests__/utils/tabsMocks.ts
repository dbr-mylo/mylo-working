
import { TextStyle, TypographyStyles } from '@/lib/types';
import { vi } from 'vitest';

// Mock test data for StyleFormTabs tests
export const mockStyles: TypographyStyles = {
  fontFamily: 'Arial',
  fontSize: '16px',
  fontWeight: '400',
  color: '#000000',
  lineHeight: '1.5',
  letterSpacing: '0px',
  textAlign: 'left',
};

export const mockParentStyle: TextStyle = {
  id: 'parent-id',
  name: 'Parent Style',
  fontFamily: 'Georgia',
  fontSize: '18px',
  fontWeight: '500',
  color: '#333333',
  lineHeight: '1.6',
  letterSpacing: '0.5px',
  selector: 'h2',
  textAlign: 'center',
};

// Mock handlers
export const mockOnNameChange = vi.fn();
export const mockOnParentChange = vi.fn();
export const mockOnStyleChange = vi.fn();

// Mock the StyleFormMetadata component for tests
export const setupMetadataMock = () => {
  vi.mock('../../StyleFormMetadata', () => ({
    StyleFormMetadata: (props) => {
      const { name, parentId, onNameChange, onParentChange } = props;
      return {
        type: 'div',
        props: {
          'data-testid': 'style-form-metadata',
          'data-name': name,
          'data-parent-id': parentId || 'none',
          children: [
            {
              type: 'button',
              props: {
                'data-testid': 'change-name-button',
                onClick: () => onNameChange('Updated Name'),
                children: 'Change Name'
              }
            },
            {
              type: 'button',
              props: {
                'data-testid': 'change-parent-button',
                onClick: () => onParentChange('new-parent-id'),
                children: 'Change Parent'
              }
            }
          ]
        }
      };
    }
  }));
};

// Mock the StyleFormControls component for tests
export const setupControlsMock = () => {
  vi.mock('../../StyleFormControls', () => ({
    StyleFormControls: (props) => {
      const { styles, onStyleChange } = props;
      return {
        type: 'div',
        props: {
          'data-testid': 'style-form-controls',
          'data-styles': JSON.stringify(styles),
          children: [
            {
              type: 'button',
              props: {
                'data-testid': 'change-font-size-button',
                onClick: () => onStyleChange('fontSize', '24px'),
                children: 'Change Font Size'
              }
            }
          ]
        }
      };
    }
  }));
};

// Mock the Tabs components for tests
export const setupTabsMock = () => {
  vi.mock('@/components/ui/tabs', () => ({
    Tabs: (props) => {
      const { children, defaultValue } = props;
      return {
        type: 'div',
        props: {
          'data-testid': 'tabs',
          'data-default-value': defaultValue,
          children
        }
      };
    },
    TabsList: (props) => {
      const { children, className } = props;
      return {
        type: 'div',
        props: {
          'data-testid': 'tabs-list',
          className,
          children
        }
      };
    },
    TabsTrigger: (props) => {
      const { children, value } = props;
      return {
        type: 'button',
        props: {
          'data-testid': `tab-${value}`,
          'data-value': value,
          children
        }
      };
    },
    TabsContent: (props) => {
      const { children, value } = props;
      return {
        type: 'div',
        props: {
          'data-testid': `tab-content-${value}`,
          'data-value': value,
          children
        }
      };
    }
  }));
};
