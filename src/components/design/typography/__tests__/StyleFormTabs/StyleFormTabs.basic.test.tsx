
import React from 'react';
import { render, screen } from '@testing-library/react';
import { StyleFormTabs } from '../../StyleFormTabs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  mockStyles, 
  mockOnNameChange, 
  mockOnParentChange, 
  mockOnStyleChange, 
  setupMetadataMock,
  setupControlsMock,
  setupTabsMock
} from '../utils/tabsMocks';

// Setup component mocks
describe('StyleFormTabs Basic Rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupMetadataMock();
    setupControlsMock();
    setupTabsMock();
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
});
