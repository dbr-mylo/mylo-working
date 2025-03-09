
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

describe('StyleFormTabs Metadata Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupMetadataMock();
    setupControlsMock();
    setupTabsMock();
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

  it('should pass the correct props to StyleFormMetadata', () => {
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
  });
});
