
import React from 'react';

export const ColorPreservationStyles = () => {
  return (
    <style>{`
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
  );
};
