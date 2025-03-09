
import React from 'react';
import { render, screen } from '@testing-library/react';
import { StyleFormPreview } from '../StyleFormPreview';
import { TextStyle, TypographyStyles } from '@/lib/types';
import { describe, it, expect, vi } from 'vitest';

// Mock TextPreview component
vi.mock('../TextPreview', () => ({
  TextPreview: ({ styles }: { styles: TypographyStyles }) => (
    <div data-testid="text-preview" data-styles={JSON.stringify(styles)}>
      Text Preview Mock
    </div>
  ),
}));

// Mock the Badge component
vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, className }: { children: React.ReactNode, className: string }) => (
    <div data-testid="badge" className={className}>{children}</div>
  ),
}));

describe('StyleFormPreview', () => {
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
    id: 'parent-style-id',
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

  it('should render with styles', () => {
    render(<StyleFormPreview styles={mockStyles} parentStyle={null} />);
    
    const previewElement = screen.getByTestId('text-preview');
    expect(previewElement).toBeInTheDocument();
    
    // Check if styles were passed correctly
    const passedStyles = JSON.parse(previewElement.getAttribute('data-styles') || '{}');
    expect(passedStyles).toEqual(mockStyles);
  });

  it('should show parent style information when a parent style is provided', () => {
    render(<StyleFormPreview styles={mockStyles} parentStyle={mockParentStyle} />);
    
    // Check if the parent style badge is displayed
    const badge = screen.getByTestId('badge');
    expect(badge).toBeInTheDocument();
    
    // Check if the parent style name is displayed
    const parentStyleName = screen.getByText('Parent Style');
    expect(parentStyleName).toBeInTheDocument();
  });

  it('should not show parent style information when no parent style is provided', () => {
    render(<StyleFormPreview styles={mockStyles} parentStyle={null} />);
    
    // Badge should not be present
    const badge = screen.queryByTestId('badge');
    expect(badge).not.toBeInTheDocument();
  });
});
