
import React, { useEffect } from 'react';

export const EditorStyles = () => {
  // Add an event listener to clear font cache when the extension requests it
  useEffect(() => {
    const handleClearFontCache = () => {
      console.log("EditorStyles: Clearing font cache from event");
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
    <>
      <style>{`
      /* Base Editor Styles */
      .ProseMirror {
        position: relative;
        outline: none;
        word-wrap: break-word;
        white-space: pre-wrap;
        white-space: break-spaces;
        -webkit-font-variant-ligatures: none;
        font-variant-ligatures: none;
        font-feature-settings: "liga" 0;
        /* Critical - establish base font-size */
        font-size: initial !important;
      }
      
      /* Placeholder */
      .ProseMirror p.is-editor-empty:first-child::before {
        content: attr(data-placeholder);
        float: left;
        color: #adb5bd;
        pointer-events: none;
        height: 0;
      }
      
      /* Lists */
      .ProseMirror ul {
        list-style-type: disc;
        padding-left: 1.5em;
      }
      
      .ProseMirror ol {
        list-style-type: decimal;
        padding-left: 1.5em;
      }
      
      /* Indentation */
      .ProseMirror *[data-indent="1"] {
        padding-left: 2em;
      }
      
      .ProseMirror *[data-indent="2"] {
        padding-left: 4em;
      }
      
      .ProseMirror *[data-indent="3"] {
        padding-left: 6em;
      }
      
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
      
      /* Force refresh for elements when cache is cleared */
      .ProseMirror.refresh-fonts [style*="font-size"],
      .ProseMirror.refresh-fonts .custom-font-size {
        opacity: 0.999; /* Trigger a repaint without visual change */
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
      .prose [data-font-size], 
      .prose-sm [data-font-size],
      .prose .custom-font-size, 
      .prose-sm .custom-font-size {
        font-size: unset !important;
      }
      
      /* Comprehensive color preservation rules - enhanced for bold text */
      /* Base rule to ensure all elements inherit their parent's color */
      .ProseMirror * {
        color: inherit;
      }
      
      /* Special class for our custom bold extension - with !important */
      .ProseMirror .color-preserving-bold {
        font-weight: bold;
        color: inherit !important;
      }
      
      /* Force color inheritance for all types of bold elements */
      .ProseMirror strong,
      .ProseMirror b {
        color: inherit !important;
        font-weight: bold;
      }
      
      /* Ensure all text formatting elements preserve parent color */
      .ProseMirror strong, 
      .ProseMirror b, 
      .ProseMirror em, 
      .ProseMirror i, 
      .ProseMirror u, 
      .ProseMirror s, 
      .ProseMirror mark {
        color: inherit !important;
      }
      
      /* Double-ensure that span elements with color styles pass their color to bold children */
      .ProseMirror span[style*="color"] strong,
      .ProseMirror span[style*="color"] b,
      .ProseMirror p[style*="color"] strong,
      .ProseMirror p[style*="color"] b,
      .ProseMirror div[style*="color"] strong,
      .ProseMirror div[style*="color"] b,
      .ProseMirror strong[style*="color"] span,
      .ProseMirror b[style*="color"] span {
        color: inherit !important;
      }
      
      /* Override any browser default for bold elements with color styles */
      .ProseMirror strong[style*="color"],
      .ProseMirror [style*="color"] strong,
      .ProseMirror b[style*="color"],
      .ProseMirror [style*="color"] b {
        color: inherit !important;
      }
      
      /* Ensure nested formatting elements preserve color */
      .ProseMirror strong em,
      .ProseMirror em strong,
      .ProseMirror b i,
      .ProseMirror i b {
        color: inherit !important;
      }
      
      /* Ensure specific formatting combinations preserve color */
      .ProseMirror em[style*="color"],
      .ProseMirror span[style*="color"] em,
      .ProseMirror span[style*="color"] strong,
      .ProseMirror p[style*="color"] strong,
      .ProseMirror p[style*="color"] em,
      .ProseMirror p[style*="color"] b {
        color: inherit !important;
      }
      
      /* Highest specificity rule to ensure marks inside colored text */
      .ProseMirror [style*="color"] mark,
      .ProseMirror mark[style*="color"] {
        background-color: transparent;
        color: inherit !important;
      }
      
      /* Force color inheritance for all inline elements, no exceptions */
      .ProseMirror p[style*="color"] *,
      .ProseMirror h1[style*="color"] *,
      .ProseMirror h2[style*="color"] *,
      .ProseMirror h3[style*="color"] *,
      .ProseMirror h4[style*="color"] *,
      .ProseMirror h5[style*="color"] *,
      .ProseMirror h6[style*="color"] *,
      .ProseMirror li[style*="color"] * {
        color: inherit !important;
      }
      
      /* Specific rule for bold and italic elements with inline styles */
      .ProseMirror span[style*="color"] strong,
      .ProseMirror strong[style*="color"],
      .ProseMirror span[style*="color"] b,
      .ProseMirror b[style*="color"] {
        color: inherit !important;
      }
      
      /* Ensure that the TipTap color-preserving-bold class always inherits color */
      .ProseMirror .color-preserving-bold[style*="color"],
      .ProseMirror span[style*="color"] .color-preserving-bold,
      .ProseMirror p[style*="color"] .color-preserving-bold {
        color: inherit !important;
      }
      
      /* Additional specificity for text-style spans containing bold elements */
      .ProseMirror .preserve-styling[style*="color"] strong,
      .ProseMirror .preserve-styling[style*="color"] b {
        color: inherit !important;
      }
      
      /* Fix for Chrome and Safari that might reset color on bold */
      .ProseMirror *[style*="color"] {
        -webkit-text-fill-color: inherit;
        -moz-text-fill-color: inherit;
      }
      
      /* Override any default browser styling for color preservation */
      .ProseMirror *[style*="color"] * {
        color: inherit !important;
        -webkit-text-fill-color: inherit;
        -moz-text-fill-color: inherit;
      }
      `}</style>
    </>
  );
};
