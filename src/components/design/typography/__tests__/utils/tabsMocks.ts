
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
    StyleFormMetadata: ({ 
      name, 
      parentId, 
      onNameChange, 
      onParentChange 
    }: { 
      name: string;
      parentId?: string;
      onNameChange: (value: string) => void;
      onParentChange: (parentId: string | undefined) => void;
    }) => (
      <div data-testid="style-form-metadata" data-name={name} data-parent-id={parentId || 'none'}>
        <button 
          data-testid="change-name-button"
          onClick={() => onNameChange('Updated Name')}
        >
          Change Name
        </button>
        <button 
          data-testid="change-parent-button"
          onClick={() => onParentChange('new-parent-id')}
        >
          Change Parent
        </button>
      </div>
    ),
  }));
};

// Mock the StyleFormControls component for tests
export const setupControlsMock = () => {
  vi.mock('../../StyleFormControls', () => ({
    StyleFormControls: ({ 
      styles, 
      onStyleChange 
    }: { 
      styles: TypographyStyles;
      onStyleChange: (property: keyof TypographyStyles, value: string) => void;
    }) => (
      <div data-testid="style-form-controls" data-styles={JSON.stringify(styles)}>
        <button 
          data-testid="change-font-size-button"
          onClick={() => onStyleChange('fontSize', '24px')}
        >
          Change Font Size
        </button>
      </div>
    ),
  }));
};

// Mock the Tabs components for tests
export const setupTabsMock = () => {
  vi.mock('@/components/ui/tabs', () => ({
    Tabs: ({ children, defaultValue }: { children: React.ReactNode; defaultValue: string }) => (
      <div data-testid="tabs" data-default-value={defaultValue}>{children}</div>
    ),
    TabsList: ({ children, className }: { children: React.ReactNode; className: string }) => (
      <div data-testid="tabs-list" className={className}>{children}</div>
    ),
    TabsTrigger: ({ children, value }: { children: React.ReactNode; value: string }) => (
      <button data-testid={`tab-${value}`} data-value={value}>{children}</button>
    ),
    TabsContent: ({ children, value }: { children: React.ReactNode; value: string }) => (
      <div data-testid={`tab-content-${value}`} data-value={value}>{children}</div>
    ),
  }));
};
