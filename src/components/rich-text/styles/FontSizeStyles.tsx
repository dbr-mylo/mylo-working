
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
        font-size: initial !important;
        --tw-prose-body: none !important;
      }
      
      /* Base rule for all elements to ensure they inherit font size by default */
      .ProseMirror * {
        font-size: inherit !important;
      }
      
      /* Override the Tailwind prose-sm font size explicitly */
      .prose.prose-sm .ProseMirror {
        font-size: initial !important;
      }
      
      /* Ensure prose doesn't force font sizes on paragraphs */
      .prose.prose-sm .ProseMirror p {
        font-size: inherit !important;
        margin-bottom: 4px;
      }
      
      /* Make elements with explicit font-size styles use their inline styles */
      .ProseMirror [style*="font-size"] {
        font-size: unset !important;
      }
      
      /* Custom class for our font-size extension with maximum specificity */
      .ProseMirror .custom-font-size {
        font-size: unset !important;
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
        font-size: unset !important;
      }
      
      /* Specifically target the preserve-styling spans with inline styles */
      .ProseMirror .preserve-styling,
      .ProseMirror .preserve-styling[style*="font-size"] {
        font-size: unset !important;
      }
      
      /* Data attribute selector for maximum compatibility */
      .ProseMirror [data-font-size] {
        font-size: attr(data-font-size px) !important;
      }
      
      /* Data style attribute selector for additional compatibility */
      .ProseMirror [data-style-fontSize] {
        font-size: attr(data-style-fontSize) !important;
      }
      
      /* Override any existing Tailwind prose classes that might set font sizes */
      .prose *, .prose-sm * {
        --tw-prose-body: none !important;
      }
      
      /* Ensure that parent font-size doesn't override child with explicit size */
      .prose [style*="font-size"], 
      .prose-sm [style*="font-size"],
      .prose [data-font-size"], 
      .prose-sm [data-font-size"],
      .prose .custom-font-size, 
      .prose-sm .custom-font-size {
        font-size: unset !important;
      }
    `}</style>
  );
};
