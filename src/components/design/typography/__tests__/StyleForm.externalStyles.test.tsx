
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StyleForm } from '../StyleForm';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  mockExternalStyles, 
  mockStyleChange, 
  setupComponentMocks 
} from './utils/styleMocks';

// Setup component mocks
setupComponentMocks();

describe('StyleForm External Styles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with external styles when provided', () => {
    render(
      <StyleForm 
        styles={mockExternalStyles} 
        handleStyleChange={mockStyleChange}
      />
    );
    
    const preview = screen.getByTestId('style-form-preview');
    const passedStyles = JSON.parse(preview.getAttribute('data-styles') || '{}');
    
    expect(passedStyles).toEqual(mockExternalStyles);
  });

  it('should call external style change handler when style change is triggered', () => {
    render(
      <StyleForm 
        styles={mockExternalStyles} 
        handleStyleChange={mockStyleChange}
      />
    );
    
    const styleChangeButton = screen.getByTestId('mock-style-change');
    fireEvent.click(styleChangeButton);
    
    expect(mockStyleChange).toHaveBeenCalledTimes(1);
    expect(mockStyleChange).toHaveBeenCalledWith('fontSize', '20px');
  });
});
