
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StyleForm } from '../StyleForm';
import { TextStyle, TypographyStyles, StyleFormData } from '@/lib/types';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the components used by StyleForm
vi.mock('../StyleFormPreview', () => ({
  StyleFormPreview: ({ styles, parentStyle }: { styles: TypographyStyles, parentStyle: TextStyle | null }) => (
    <div data-testid="style-form-preview" data-styles={JSON.stringify(styles)} data-parent={parentStyle ? parentStyle.id : 'none'}>
      Style Preview
    </div>
  ),
}));

vi.mock('../StyleFormTabs', () => ({
  StyleFormTabs: ({ 
    name, 
    parentId, 
    styles, 
    onNameChange, 
    onStyleChange, 
    showFormFields 
  }: { 
    name: string, 
    parentId?: string, 
    styles: TypographyStyles, 
    onNameChange: (name: string) => void, 
    onStyleChange: (property: keyof TypographyStyles, value: string) => void, 
    showFormFields: boolean
  }) => (
    <div data-testid="style-form-tabs" data-name={name} data-parent-id={parentId || 'none'} data-show-fields={String(showFormFields)}>
      <button data-testid="mock-name-change" onClick={() => onNameChange('Changed Name')}>Change Name</button>
      <button data-testid="mock-style-change" onClick={() => onStyleChange('fontSize', '20px')}>Change Font Size</button>
    </div>
  ),
}));

vi.mock('../StyleFormActions', () => ({
  StyleFormActions: ({ 
    showActions, 
    isUpdate, 
    onCancel, 
    onSubmit 
  }: { 
    showActions: boolean, 
    isUpdate: boolean, 
    onCancel: () => void, 
    onSubmit: (e: React.FormEvent) => void 
  }) => (
    <div data-testid="style-form-actions" data-show-actions={String(showActions)} data-is-update={String(isUpdate)}>
      <button data-testid="mock-cancel" onClick={onCancel}>Cancel</button>
      <button data-testid="mock-submit" onClick={e => onSubmit(e as unknown as React.FormEvent)}>Submit</button>
    </div>
  ),
}));

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

describe('StyleForm', () => {
  const mockInitialValues: TextStyle = {
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

  const mockSubmit = vi.fn();
  const mockStyleChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with external styles when provided', () => {
    const externalStyles: TypographyStyles = {
      fontFamily: 'Helvetica',
      fontSize: '14px',
      fontWeight: '300',
      color: '#111111',
      lineHeight: '1.4',
      letterSpacing: '1px',
      textAlign: 'right',
    };

    render(
      <StyleForm 
        styles={externalStyles} 
        handleStyleChange={mockStyleChange}
      />
    );
    
    const preview = screen.getByTestId('style-form-preview');
    const passedStyles = JSON.parse(preview.getAttribute('data-styles') || '{}');
    
    expect(passedStyles).toEqual(externalStyles);
  });

  it('should render with initialValues when provided', () => {
    render(
      <StyleForm 
        initialValues={mockInitialValues} 
        onSubmit={mockSubmit}
      />
    );
    
    const preview = screen.getByTestId('style-form-preview');
    const tabs = screen.getByTestId('style-form-tabs');
    
    expect(tabs).toHaveAttribute('data-name', mockInitialValues.name);
  });

  it('should update name when name change event is triggered', () => {
    render(
      <StyleForm 
        initialValues={mockInitialValues} 
        onSubmit={mockSubmit}
      />
    );
    
    const nameChangeButton = screen.getByTestId('mock-name-change');
    fireEvent.click(nameChangeButton);
    
    const tabs = screen.getByTestId('style-form-tabs');
    expect(tabs).toHaveAttribute('data-name', 'Changed Name');
  });

  it('should call onSubmit with form data when form is submitted', () => {
    render(
      <StyleForm 
        initialValues={mockInitialValues} 
        onSubmit={mockSubmit}
      />
    );
    
    const submitButton = screen.getByTestId('mock-submit');
    fireEvent.click(submitButton);
    
    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({
      name: mockInitialValues.name,
      fontFamily: mockInitialValues.fontFamily,
      fontSize: mockInitialValues.fontSize,
      fontWeight: mockInitialValues.fontWeight,
      color: mockInitialValues.color,
      lineHeight: mockInitialValues.lineHeight,
      letterSpacing: mockInitialValues.letterSpacing,
      textAlign: mockInitialValues.textAlign,
    }));
  });

  it('should call external style change handler when style change is triggered', () => {
    const externalStyles: TypographyStyles = {
      fontFamily: 'Helvetica',
      fontSize: '14px',
      fontWeight: '300',
      color: '#111111',
      lineHeight: '1.4',
      letterSpacing: '1px',
      textAlign: 'right',
    };

    render(
      <StyleForm 
        styles={externalStyles} 
        handleStyleChange={mockStyleChange}
      />
    );
    
    const styleChangeButton = screen.getByTestId('mock-style-change');
    fireEvent.click(styleChangeButton);
    
    expect(mockStyleChange).toHaveBeenCalledTimes(1);
    expect(mockStyleChange).toHaveBeenCalledWith('fontSize', '20px');
  });

  it('should show warning in console when neither onSubmit nor handleStyleChange is provided', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    render(<StyleForm />);
    
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "StyleForm requires either onSubmit or handleStyleChange prop"
    );
    
    consoleWarnSpy.mockRestore();
  });

  it('should fetch and set parent style when parentId changes', async () => {
    const mockWithParent = {
      ...mockInitialValues,
      parentId: 'parent-id',
    };

    const { findByTestId } = render(
      <StyleForm 
        initialValues={mockWithParent} 
        onSubmit={mockSubmit}
      />
    );
    
    // Initially parent is not set yet (async operation)
    const initialPreview = screen.getByTestId('style-form-preview');
    expect(initialPreview).toHaveAttribute('data-parent', 'none');
    
    // After the async operation completes
    const updatedPreview = await findByTestId('style-form-preview');
    expect(updatedPreview).toHaveAttribute('data-parent', 'parent-id');
  });
});
