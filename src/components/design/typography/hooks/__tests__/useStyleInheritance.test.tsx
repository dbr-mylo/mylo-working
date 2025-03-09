
import { renderHook, act, waitFor } from '@testing-library/react';
import { useStyleInheritance } from '../useStyleInheritance';
import { textStyleStore } from '@/stores/textStyles';
import { TextStyle } from '@/lib/types';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock the dependencies
vi.mock('@/stores/textStyles', () => ({
  textStyleStore: {
    getTextStyles: vi.fn(),
  },
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('useStyleInheritance', () => {
  // Sample text styles for testing
  const mockStyles: TextStyle[] = [
    {
      id: 'style1',
      name: 'Style 1',
      fontFamily: 'Arial',
      fontSize: '16px',
      fontWeight: '400',
      color: '#000000',
      lineHeight: '1.5',
      letterSpacing: 'normal',
      selector: 'h1',
    },
    {
      id: 'style2',
      name: 'Style 2',
      fontFamily: 'Arial',
      fontSize: '14px',
      fontWeight: '400',
      color: '#111111',
      lineHeight: '1.4',
      letterSpacing: 'normal',
      selector: 'h2',
      parentId: 'style1',
    },
    {
      id: 'style3',
      name: 'Style 3',
      fontFamily: 'Arial',
      fontSize: '12px',
      fontWeight: '400',
      color: '#222222',
      lineHeight: '1.3',
      letterSpacing: 'normal',
      selector: 'h3',
      parentId: 'style2',
    },
  ];

  // Circular dependency scenario
  const circularStyles: TextStyle[] = [
    ...mockStyles,
    {
      id: 'style4',
      name: 'Style 4',
      fontFamily: 'Arial',
      fontSize: '12px',
      fontWeight: '400',
      color: '#333333',
      lineHeight: '1.2',
      letterSpacing: 'normal',
      selector: 'h4',
      parentId: 'style5',
    },
    {
      id: 'style5',
      name: 'Style 5',
      fontFamily: 'Arial',
      fontSize: '10px',
      fontWeight: '400',
      color: '#444444',
      lineHeight: '1.1',
      letterSpacing: 'normal',
      selector: 'h5',
      parentId: 'style4',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should load styles and filter out the current style', async () => {
    (textStyleStore.getTextStyles as any).mockResolvedValue(mockStyles);
    
    const { result } = renderHook(() => useStyleInheritance({ 
      currentStyleId: 'style1', 
      parentId: undefined 
    }));
    
    // Initially should be loading
    expect(result.current.loading).toBe(true);
    
    // Wait for the async operations to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Should filter out style1 (the current style)
    expect(result.current.styles).toHaveLength(2);
    expect(result.current.styles.find(s => s.id === 'style1')).toBeUndefined();
    expect(result.current.inheritanceChain).toHaveLength(0);
  });

  it('should load inheritance chain when parentId is provided', async () => {
    (textStyleStore.getTextStyles as any).mockResolvedValue(mockStyles);
    
    const { result } = renderHook(() => useStyleInheritance({ 
      currentStyleId: 'style3', 
      parentId: 'style2' 
    }));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Should have a chain of style2 -> style1
    expect(result.current.inheritanceChain).toHaveLength(2);
    expect(result.current.inheritanceChain[0].id).toBe('style2');
    expect(result.current.inheritanceChain[1].id).toBe('style1');
  });

  it('should detect and prevent circular dependencies', async () => {
    (textStyleStore.getTextStyles as any).mockResolvedValue(circularStyles);
    
    const { result } = renderHook(() => useStyleInheritance({ 
      currentStyleId: 'style4', 
      parentId: undefined 
    }));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Should exclude style5 because it would create a circular dependency
    expect(result.current.styles.find(s => s.id === 'style5')).toBeUndefined();
  });

  it('should handle edge case where a style in the inheritance chain is not found', async () => {
    // Mock a broken inheritance chain
    const brokenChainStyles = [
      ...mockStyles,
      {
        id: 'style6',
        name: 'Style 6',
        fontFamily: 'Arial',
        fontSize: '10px',
        fontWeight: '400',
        color: '#555555',
        lineHeight: '1.0',
        letterSpacing: 'normal',
        selector: 'h6',
        parentId: 'non-existent-style', // This parent doesn't exist
      },
    ];
    
    (textStyleStore.getTextStyles as any).mockResolvedValue(brokenChainStyles);
    
    const { result } = renderHook(() => useStyleInheritance({ 
      currentStyleId: undefined, 
      parentId: 'style6' 
    }));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Should only include style6 in the chain since its parent doesn't exist
    expect(result.current.inheritanceChain).toHaveLength(1);
    expect(result.current.inheritanceChain[0].id).toBe('style6');
  });

  it('should handle API errors gracefully', async () => {
    // Simulate an API error
    (textStyleStore.getTextStyles as any).mockRejectedValue(new Error('API Error'));
    
    const { result } = renderHook(() => useStyleInheritance({ 
      currentStyleId: 'style1', 
      parentId: 'style2' 
    }));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.error).toBeTruthy();
    expect(result.current.styles).toHaveLength(0);
    expect(result.current.inheritanceChain).toHaveLength(0);
  });
});
