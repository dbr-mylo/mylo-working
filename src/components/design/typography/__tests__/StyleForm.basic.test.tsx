
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StyleForm } from '../StyleForm';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  mockInitialValues, 
  mockSubmit, 
  mockStyleChange, 
  setupComponentMocks 
} from './utils/styleMocks';

// Setup component mocks
setupComponentMocks();

describe('StyleForm Basic Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  it('should show warning in console when neither onSubmit nor handleStyleChange is provided', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    render(<StyleForm />);
    
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "StyleForm requires either onSubmit or handleStyleChange prop"
    );
    
    consoleWarnSpy.mockRestore();
  });
});
