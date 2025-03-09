
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StyleFormTabs } from '../../StyleFormTabs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  mockStyles, 
  mockParentStyle,
  mockOnNameChange, 
  mockOnParentChange, 
  mockOnStyleChange, 
  setupMetadataMock,
  setupControlsMock,
  setupTabsMock
} from '../utils/tabsMocks';

describe('StyleFormTabs Controls Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupMetadataMock();
    setupControlsMock();
    setupTabsMock();
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

  it('should pass the correct props to StyleFormControls', () => {
    render(
      <StyleFormTabs
        name="Test Style"
        styles={mockStyles}
        onNameChange={mockOnNameChange}
        onParentChange={mockOnParentChange}
        onStyleChange={mockOnStyleChange}
        showFormFields={true}
        parentStyle={mockParentStyle}
      />
    );
    
    const controls = screen.getByTestId('style-form-controls');
    const passedStyles = JSON.parse(controls.getAttribute('data-styles') || '{}');
    expect(passedStyles).toEqual(mockStyles);
  });
});
