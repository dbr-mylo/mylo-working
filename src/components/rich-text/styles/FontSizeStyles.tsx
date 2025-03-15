
import React, { useEffect } from 'react';

export const FontSizeStyles = () => {
  // Add an event listener to clear font cache when the extension requests it
  useEffect(() => {
    const handleClearFontCache = () => {
      console.log("FontSizeStyles: Clearing font cache from event");
      // Force refresh specific styles by toggling a class briefly
      const editors = document.querySelectorAll('.ProseMirror');
      editors.forEach(editor => {
        editor.classList.add('refresh-fonts');
        setTimeout(() => editor.classList.remove('refresh-fonts'), 10);
      });
    };
    
    document.addEventListener('tiptap-clear-font-cache', handleClearFontCache);
    return () => document.removeEventListener('tiptap-clear-font-cache', handleClearFontCache);
  }, []);

  return (
    <style>{`
      /* Critical fix for the root elements to prevent Tailwind prose classes from overriding font sizes */
      .ProseMirror {
        font-size: 16px !important;
        --tw-prose-body: none !important;
      }
      
      /* Base rule for all elements to ensure they inherit font size by default */
      .ProseMirror * {
        font-size: inherit;
      }
      
      /* Override the Tailwind prose-sm font size explicitly */
      .prose.prose-sm .ProseMirror {
        font-size: 16px !important;
      }
      
      /* Ensure prose doesn't force font sizes on paragraphs */
      .prose.prose-sm .ProseMirror p {
        margin-bottom: 4px;
      }
      
      /* THIS IS THE CRITICAL FIX: Allow styles to be applied directly */
      .ProseMirror [style*="font-size"] {
        font-size: var(--applied-font-size, unset) !important;
      }
      
      /* Additional specific selectors for common elements with max specificity */
      .ProseMirror span[style*="font-size"],
      .ProseMirror p[style*="font-size"],
      .ProseMirror div[style*="font-size"],
      .ProseMirror h1[style*="font-size"],
      .ProseMirror h2[style*="font-size"],
      .ProseMirror h3[style*="font-size"],
      .ProseMirror h4[style*="font-size"],
      .ProseMirror h5[style*="font-size"],
      .ProseMirror h6[style*="font-size"] {
        font-size: var(--applied-font-size, unset) !important;
      }
      
      /* Force styles to be read from element */
      span[style*="font-size"], 
      p[style*="font-size"],
      div[style*="font-size"] {
        font-size: var(--applied-font-size, unset) !important;
      }

      /* Remove this default value that might be causing issues */
      .ProseMirror .preserve-styling[style*="font-size:20px"] {
        /* This was forcing 20px specifically */
        /* font-size: 20px !important; */
      }
      
      /* Initial default size that matches the toolbar's default */
      .ProseMirror {
        font-size: 16px !important;
      }
      
      /* Only apply specific sizes when explicitly set */
      .ProseMirror p:not([style*="font-size"]) {
        font-size: 16px !important;
      }
      
      /* Add a specific class for refreshing fonts */
      .ProseMirror.refresh-fonts {
        transform: translateZ(0);
      }
    `}</style>
  );
};
