
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StyleFormTabs } from '../StyleFormTabs';
import { TextStyle, TypographyStyles } from '@/lib/types';
import { describe, it, expect, vi } from 'vitest';

// Mock the StyleFormMetadata and StyleFormControls components
vi.mock('../StyleFormMetadata', () => ({
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

vi.mock('../StyleFormControls', () => ({
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

// Mock the Tabs components
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

describe('StyleFormTabs', () => {
  const mockStyles: TypographyStyles = {
    fontFamily: 'Arial',
    fontSize: '16px',
    fontWeight: '400',
    color: '#000000',
    lineHeight: '1.5',
    letterSpacing: '0px',
    textAlign: 'left',
  };

  const mockParentStyle: TextStyle = {
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

  const mockOnNameChange = vi.fn();
  const mockOnParentChange = vi.fn();
  const mockOnStyleChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with tabs and default to the "basic" tab', () => {
    render(
      <StyleFormTabs
        name="Test Style"
        styles={mockStyles}
        onNameChange={mockOnNameChange}
        onParentChange={mockOnParentChange}
        onStyleChange={mockOnStyleChange}
        showFormFields={true}
        parentStyle={null}
      />
    );

    const tabs = screen.getByTestId('tabs');
    expect(tabs).toHaveAttribute('data-default-value', 'basic');
    
    const basicTab = screen.getByTestId('tab-basic');
    expect(basicTab).toBeInTheDocument();
    
    const typographyTab = screen.getByTestId('tab-typography');
    expect(typographyTab).toBeInTheDocument();
    
    const basicContent = screen.getByTestId('tab-content-basic');
    expect(basicContent).toBeInTheDocument();
    
    const typographyContent = screen.getByTestId('tab-content-typography');
    expect(typographyContent).toBeInTheDocument();
  });

  it('should render StyleFormMetadata when showFormFields is true', () => {
    render(
      <StyleFormTabs
        name="Test Style"
        styles={mockStyles}
        onNameChange={mockOnNameChange}
        onParentChange={mockOnParentChange}
        onStyleChange={mockOnStyleChange}
        showFormFields={true}
        parentStyle={null}
      />
    );

    const metadata = screen.getByTestId('style-form-metadata');
    expect(metadata).toBeInTheDocument();
  });

  it('should not render StyleFormMetadata when showFormFields is false', () => {
    render(
      <StyleFormTabs
        name="Test Style"
        styles={mockStyles}
        onNameChange={mockOnNameChange}
        onParentChange={mockOnParentChange}
        onStyleChange={mockOnStyleChange}
        showFormFields={false}
        parentStyle={null}
      />
    );

    const metadata = screen.queryByTestId('style-form-metadata');
    expect(metadata).not.toBeInTheDocument();
  });

  it('should always render StyleFormControls regardless of showFormFields', () => {
    render(
      <StyleFormTabs
        name="Test Style"
        styles={mockStyles}
        onNameChange={mockOnNameChange}
        onParentChange={mockOnParentChange}
        onStyleChange={mockOnStyleChange}
        showFormFields={false}
        parentStyle={null}
      />
    );

    const controls = screen.getByTestId('style-form-controls');
    expect(controls).toBeInTheDocument();
  });

  it('should call onNameChange when name is updated', () => {
    render(
      <StyleFormTabs
        name="Test Style"
        styles={mockStyles}
        onNameChange={mockOnNameChange}
        onParentChange={mockOnParentChange}
        onStyleChange={mockOnStyleChange}
        showFormFields={true}
        parentStyle={null}
      />
    );

    const changeNameButton = screen.getByTestId('change-name-button');
    fireEvent.click(changeNameButton);
    
    expect(mockOnNameChange).toHaveBeenCalledWith('Updated Name');
  });

  it('should call onParentChange when parent is updated', () => {
    render(
      <StyleFormTabs
        name="Test Style"
        styles={mockStyles}
        onNameChange={mockOnNameChange}
        onParentChange={mockOnParentChange}
        onStyleChange={mockOnStyleChange}
        showFormFields={true}
        parentStyle={null}
      />
    );

    const changeParentButton = screen.getByTestId('change-parent-button');
    fireEvent.click(changeParentButton);
    
    expect(mockOnParentChange).toHaveBeenCalledWith('new-parent-id');
  });

  it('should call onStyleChange when style is updated', () => {
    render(
      <StyleFormTabs
        name="Test Style"
        styles={mockStyles}
        onNameChange={mockOnNameChange}
        onParentChange={mockOnParentChange}
        onStyleChange={mockOnStyleChange}
        showFormFields={true}
        parentStyle={null}
      />
    );

    const changeFontSizeButton = screen.getByTestId('change-font-size-button');
    fireEvent.click(changeFontSizeButton);
    
    expect(mockOnStyleChange).toHaveBeenCalledWith('fontSize', '24px');
  });

  it('should pass the correct props to child components', () => {
    render(
      <StyleFormTabs
        name="Test Style"
        parentId="parent-id"
        currentStyleId="current-id"
        styles={mockStyles}
        onNameChange={mockOnNameChange}
        onParentChange={mockOnParentChange}
        onStyleChange={mockOnStyleChange}
        showFormFields={true}
        parentStyle={mockParentStyle}
      />
    );

    const metadata = screen.getByTestId('style-form-metadata');
    expect(metadata).toHaveAttribute('data-name', 'Test Style');
    expect(metadata).toHaveAttribute('data-parent-id', 'parent-id');
    
    const controls = screen.getByTestId('style-form-controls');
    const passedStyles = JSON.parse(controls.getAttribute('data-styles') || '{}');
    expect(passedStyles).toEqual(mockStyles);
  });
});
